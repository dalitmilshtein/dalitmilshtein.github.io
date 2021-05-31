define(['pipAPI'], function(APIconstructor) {
  
  var API     = new APIconstructor();
  API.addSettings('onEnd', window.minnoJS.onEnd);
  
  
  API.addSettings('logger', {
    // gather logs in array
    onRow: function(logName, log, settings, ctx){
      if (!ctx.logs) ctx.logs = [];
      ctx.logs.push(log);
    },
    // onEnd trigger save (by returning a value)
    onEnd: function(name, settings, ctx){
      return ctx.logs;
    },
    // Transform logs into a string
    // we save as CSV because qualtrics limits to 20K characters and this is more efficient.
    serialize: function (name, logs) {
      var headers = ['responce', 'latency', 'idscript'];
      var content = logs.map(function (log) { return [log.responseHandle, log.latency, log.data.sid]; });
      content.unshift(headers);
      return toCsv(content);
      
      function toCsv(matrice) { return matrice.map(buildRow).join('\n'); }
      function buildRow(arr) { return arr.map(normalize).join(','); }
      // wrap in double quotes and escape inner double quotes
      function normalize(val) {
        var quotableRgx = /(\n|,|")/;
                if (quotableRgx.test(val)) return '"' + val.replace(/"/g, '""') + '"';
                return val;
            }
        },
        // Set logs into an input (i.e. put them wherever you want)
        send: function(name, serialized){
            window.minnoJS.logger(serialized);
        }
    });


    var global  = API.getGlobal();
    var current = API.getCurrent();

    var version_id  = Math.random()>0.5 ? 2 : 1;
    var all_answers = [['i', 'e'], ['i', 'e']];
    var answers     = all_answers[version_id-1];

 	API.addCurrent({
 	    version_id   : version_id,
 	    answers      : answers,
        instructions: {
            inst_welcome : ` 
                            <p> במהלך הניסוי תתבקשו לקרוא ולדמיין 120 משפטים    </p></br>
                            <p>  לאחר  כול משפטים תתבקשו לענות  5 שאלות </p></br>                          
                            <p> אתם בוחרים את התשובה המתאימה לכם באמצעות לחיצה על מקש המקלדת  </p></br>
                            <p>אנא הקישו על מקש הרווח במקלדת על מנת להתחיל  </p>`,
          

            inst_bye     : `<p>הניסוי הסתיים</p> 
                            <p>תודה על השתתפותכם</p>
                            <p>לסיום לחץ על מקש רווח</p>`
        },
        times: {
            fixation_duration : 500,
            stimulus_duration : 500,
            response_duration : 1000,
            feedback_duration : 1000,
            iti_duration      : 1000
        },
        
        minScore4exp    : 2,
        score           : 0
	}); 
    
	 

    API.addSettings('canvas',{
        textSize         : 5,
        maxWidth         : 1200,
        proportions      : 0.65,
        borderWidth      : 0.4,
        background       : '#ffffff',
        canvasBackground : '#ffffff'	
    });

    API.addSettings('base_url',{
        image : global.baseURL
    });

    /***********************************************
    // Stimuli
     ***********************************************/

    API.addStimulusSets({
        defaultStim : [{css:{color:'black', 'font-size':'30px'}}],
        Q1          : [{inherit:'defaultStim', media: 'סמן מ-1 עד 9 מה עוצמת הרגש  שהתעורר בך  כשקראת ודימיינת את המשפט '}],    
	Q2         : [{inherit:'defaultStim', media: 'סמן מ-1 עד 9 מה הסיכוי שתמצא את עצמך במצב המתואר במשפט'}],
        Q3         : [{inherit:'defaultStim', media: 'סמן מ-1 עד  -9  עד  כמה המצב שאתה מדמיין חי ומפורט'}],
        Q4          : [{inherit:'defaultStim', media: 'סמן מ-1 עד -9 כמה מאמץ השקעת על מנת להפסיק לחשוב על המצב המתואר במשפט '}],    
	Q5         : [{inherit:'defaultStim', media: ' סמן מ-1 עד -9 כמה המצב המתואר במשפט קשור לפחדים שלך '}]   
	    
    });


    API.addStimulusSets({
        inst_welcome : [{media: {html: current.instructions.inst_welcome}}],
        inst_start   : [{media: {html: current.instructions.inst_start}}],
        inst_bye     : [{media: {html: current.instructions.inst_bye}}]
    });

    API.addTrialSets('endOfPractice',{
        input: [ 
			{handle:'end', on: 'timeout', duration: 0}
        ],
        interactions: [
            {
                conditions: [
                    {type:'custom',fn: function(){return global.current.score < global.current.minScore4exp;}},
                ],
                actions: [
                    {type:'custom',fn: function(){global.current.score=0;}},
                    {type:'goto',destination: 'previousWhere', properties: {practice:true}},
                    {type:'endTrial'}				
                ]
            },  
            {
                conditions: [ 
                    {type:'custom',fn: function(){return global.current.score >= global.current.minScore4exp;}}
                ],
                actions: [
                    {type:'custom',fn: function(){global.current.score=0;}},
                    {type:'goto',destination: 'nextWhere', properties: {exp:true}},
                    {type:'endTrial'}				
                ]
            },
        ]
    });


    API.addTrialSets('startPractice',{
        input: [ 
			{handle:'end', on: 'timeout', duration: 0}
        ],
        interactions: [
            {
                conditions: [
                    {type:'custom',fn: function(){return true;}}

                ],
                actions: [
                    {type:'endTrial'}				
                ]
            }
        ]
    });



    /***********************************************
    // INSTRUCTIONS TRIAL
     ***********************************************/    



    API.addTrialSets('insts',{
        input: [ 
            {handle:'space',on:'space'} 
        ],
        interactions: [
            { 
                conditions: [{type:'inputEquals',value:'space'}], 
                actions: [
                    {type:'log'}, 
                    {type:'endTrial'}				
                ]
            }
        ]
    });
    
    
    API.addTrialSets('inst_welcome',{
        inherit:'insts',
	    layout: [
	        {media: {html: current.instructions.inst_welcome}}
        ]
    });

    
    API.addTrialSets('inst_bye',{
        inherit:'insts',
	    layout: [
	        {media: {html: current.instructions.inst_bye}}
        ]
    });

   
	/***********************************************
    // Main trials
     ***********************************************/

    API.addTrialSets('stimulus_trial',[{ 
        data: {score:0},
        interactions: [
            { 
                conditions: [{type:'begin'}],
                actions: [
        		    {type:'setInput', input:{handle:'qest', on: 'keypressed', key: ' '}},
        		    {type:'showStim', handle: 'target'},
                    {type:'resetTimer'},
                ]
            },
            {
                conditions: [{type:'inputEquals', value:'qest'}], 
            ctions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q1_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q1_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q1_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q1_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q1_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q1_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q1_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q1_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q1_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q1'},
                ]
            }, 	


            {
                conditions: [
                    {type:'inputEquals', value:['q1_1', 'q1_2', 'q1_3', 'q1_4', 'q1_5', 'q1_6', 'q1_7', 'q1_8', 'q1_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q2_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q2_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q2_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q2_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q2_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q2_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q2_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q2_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q2_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q2'},
                ]
            }, 
            
            {
                conditions: [
                    {type:'inputEquals', value:['q2_1', 'q2_2', 'q2_3', 'q2_4', 'q2_5', 'q2_6', 'q2_7', 'q2_8', 'q2_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q3_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q3_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q3_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q3_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q3_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q3_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q3_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q3_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q3_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q3'},
                ]
            }, 
            
            {
                conditions: [
                    {type:'inputEquals', value:['q3_1', 'q3_2', 'q3_3', 'q3_4', 'q3_5', 'q3_6', 'q3_7', 'q3_8', 'q3_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q4_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q4_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q4_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q4_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q4_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q4_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q4_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q4_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q4_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q4'},
                ]
            }, 

            
            {
                conditions: [
                    {type:'inputEquals', value:['q4_1', 'q4_2', 'q4_3', 'q4_4', 'q4_5', 'q4_6', 'q4_7', 'q4_8', 'q4_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q5_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q5_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q5_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q5_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q5_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q5_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q5_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q5_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q5_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q5'},
                ]
            }, 
            
            {
                conditions: [
                    {type:'inputEquals', value:['q5_1', 'q5_2', 'q5_3', 'q5_4', 'q5_5', 'q5_6', 'q5_7', 'q5_8', 'q5_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
                    {type:'endTrial'}
                ]
            }, 
            
            
            
            {
                conditions: [{type:'inputEquals', value:'end'}],
                actions: [{type:'endTrial'}]
            }
        ],
        stimuli : [
            {inherit:'Q1'},
            {inherit:'Q2'},
            {inherit:'Q3'},
            {inherit:'Q4'},
            {inherit:'Q5'},
            {inherit:'Q6'},
            {inherit:'Q7'},
            {inherit:'Q8'},
            {inherit:'Q9'},
            { media: '<%= trialData.text %>', css:{fontSize: '30px'}, handle:'target', data:{sid:'<%= trialData.sid %>'}}


        ]
    }]);

    /***********************************************
    // Script
     ***********************************************/

    
    
    API.addTrialSet('scripts', [
        {inherit: 'stimulus_trial', data: {text: 'امي تقوم باحتضاني وتوعدني انها ستقوم بالحفاظ علي دائما ', sid: 1}},
        {inherit: 'stimulus_trial', data: {text: 'انا  بالدكان ابحث عن هديه لوالداي بمناسبة عيد زواجهما ', sid: 2}},
        {inherit: 'stimulus_trial', data: {text: 'والداي يحضرون لي في عيد ميلادي تذكرة سفر للخارج ', sid: 3}},
        {inherit: 'stimulus_trial', data: {text: 'انا افوز بالمرتبه الأولى واحصل على منحه تعليميه كامله ', sid: 15}},
        {inherit: 'stimulus_trial', data: {text: 'انا واصدقائي نرقص كل الليل في حفل تخرجنا الجامعي  ', sid: 16}},
        {inherit: 'stimulus_trial', data: {text: 'لقد اخترت ضمن البعثه الطلابيه الى كندا هذا الصيف  ', sid: 17}},
        {inherit: 'stimulus_trial', data: {text: 'أقوم بإصدار البومي الموسيقي الأول ويقوم بحصد ملايين المبيعات  ', sid: 29}},
        {inherit: 'stimulus_trial', data: {text: 'انا اتلقى مكالمه هاتفيه حول إيجاد كمبيوتري الضائع   ', sid: 30}},
	{inherit: 'stimulus_trial', data: {text: 'بينما احفر في ساحة البيت أقوم بإيجاد مالا مدفونا  ', sid:31}},
        {inherit: 'stimulus_trial', data: {text: 'نجري فحص لنسبة المخدرات بدم اخي والنتيجه خالي كليا ', sid: 43}},
        {inherit: 'stimulus_trial', data: {text: 'انا اجري فحوصات طبيه والطبيب يخبرني اني صحي للغايه ', sid: 44}},
        {inherit: 'stimulus_trial', data: {text: 'انا اذهب الى اليونان للمشاركه بمساعدة تمويل اللاجئين السوريين  ', sid: 45}},
        {inherit: 'stimulus_trial', data: {text: 'انا ادخل البيت واجد مفاجاه لي بمناسبة عيد ميلادي   ', sid: 55}},
        {inherit: 'stimulus_trial', data: {text: 'انا اتلقى مكالمه هاتفيه حول قبولي في مقابلة العمل  ', sid: 56}},
        {inherit: 'stimulus_trial', data: {text: 'انا واصدقائي مسافرون جميعا  في السياره متجهون الى البحر   ', sid: 57}},
        {inherit: 'stimulus_trial', data: {text: 'انا اجلس امام البحيره على كرسي خشبي وبيدي قهوتي   ', sid: 58}},
        {inherit: 'stimulus_trial', data: {text: 'يتصلون لاخباري عن توقيف تعليمي الجامعي بسبب علاماتي المنخفضه    ', sid: 71}},
        {inherit: 'stimulus_trial', data: {text: 'محاضرتي الجامعيه تحاول ان تغتصبني بعد ان قمت برفضها ', sid: 72}},
        {inherit: 'stimulus_trial', data: {text: ' انا اغفو بالقطار وتسرق حقيبتي اللتي تحتوي حاسوبي النقال    ', sid: 73}},
        {inherit: 'stimulus_trial', data: {text: 'جدي يقوم بتعنيفي امام والداي وهم لا يحركون ساكنا  ', sid: 82}},
        {inherit: 'stimulus_trial', data: {text: 'امي تخبرني ان لديها كتل سرطانيه منتشره بانحاء جسدها  ', sid: 83}},
        {inherit: 'stimulus_trial', data: {text: 'انا انتظر مع ابي في المشفى لتلقيه العلاج الكيميائي ', sid: 84}},
        {inherit: 'stimulus_trial', data: {text: ' انا ارى علامه موجبه على فاحص  حمل لاختي العزباء   ', sid: 93}},
        {inherit: 'stimulus_trial', data: {text: ' في حين تجولي خارجا اسمع صوت صافرات وذوي انفجار   ', sid: 94}},
	{inherit: 'stimulus_trial', data: {text: 'بسبب جرح لم اعاينه في يدي سيقومون بقطعها كليا  ', sid: 95}},
        {inherit: 'stimulus_trial', data: {text: 'انتهى اليوم ولم اتلقى اي تهنئه بمناسبة عيد ميلادي ', sid: 104}},
        {inherit: 'stimulus_trial', data: {text: ' انا اقف خلف الباب واسمع أصدقائي يقومون بالسخرية مني ', sid: 105}},
        {inherit: 'stimulus_trial', data: {text: 'بسبب ازديادي  بالوزن لا اقدر على غلق زر بنطالي  ', sid: 106}},
        {inherit: 'stimulus_trial', data: {text: 'عجوز يتجاوزني في الطابور معلقا ان لا مكان لعربي هنا    ', sid: 115}},
        {inherit: 'stimulus_trial', data: {text: 'اذهب للملجا بعد سماع الصافرات واليهود لا يقومون بادخالي   ', sid: 116}},
        {inherit: 'stimulus_trial', data: {text: 'بعد ان تخرجت بامتياز لا يوظفونني بسبب كوني عربيا   ', sid: 117}},
        {inherit: 'stimulus_trial', data: {text: '      انا ادخل يدي الى جيبي ولا اجد الشيك فيها   ', sid: 126}},
        {inherit: 'stimulus_trial', data: {text: 'اكتشف اني القيت للنفايات المال الذي اعطتني إياه امي  ', sid: 127}},
        {inherit: 'stimulus_trial', data: {text: '    اكتشف ان المال اللذي وفرته جانبا للسفر قد سرق ', sid: 128}},
        {inherit: 'stimulus_trial', data: {text: 'انا اقوم بتغليف رزمة ورق واضعهم في داخل الصناديق ', sid: 141}},
        {inherit: 'stimulus_trial', data: {text: ' انا ادخل الصف واجلس على كرسيي منتظرا حضور المحاضر ', sid: 142}},
        {inherit: 'stimulus_trial', data: {text: 'انتظر ثلاث دقائق حتى يسخن الماء في المسخن الكهربائي   ', sid: 143}},
        {inherit: 'stimulus_trial', data: {text: 'انا اسمع صوت الناس يتهامسون في الغرفه المجاوره الي   ', sid: 144}},
        {inherit: 'stimulus_trial', data: {text: 'أقوم بإزالة الغطاء عن العلبه وارميه في سلة القمامه  ', sid: 145}},
        {inherit: 'stimulus_trial', data: {text: 'انا انعطف لليمين اعبر من خلف الحديقه نحو البيت   ', sid: 146}},
	{inherit: 'stimulus_trial', data: {text: 'أقوم بشغيل الجهاز بعد ان قرات التعليمات حول استخدامه ', sid: 147}},
        {inherit: 'stimulus_trial', data: {text: 'أقوم بوضع اشاره الى اين وصلت في الكتاب واغلقه ', sid: 148}},
        {inherit: 'stimulus_trial', data: {text: 'انا ادخل الى الصالون واعبر منه الى الشرفه الاماميه  ', sid: 149}},
        {inherit: 'stimulus_trial', data: {text: 'انا اضع اللاصقات على الكتب وارتبهم على رف المكتبه   ', sid:150}},
        {inherit: 'stimulus_trial', data: {text: 'انا افتح خزانة المطبخ لكي اتناول ملعقة طعام وصحن    ', sid: 151}},
        {inherit: 'stimulus_trial', data: {text: 'انا اطفا الضوء في الغرفه قبل ان أقوم باغلاقها   ', sid: 152}},
        {inherit: 'stimulus_trial', data: {text: 'انا اوظب طاولة الطعام واضع الصحون في الجلاية   ', sid: 153}},
        {inherit: 'stimulus_trial', data: {text: 'انا ادير مفك البراغي الى اليمين واشد المسمار به     ', sid: 154}},
        {inherit: 'stimulus_trial', data: {text: 'انا اقوم بثقب الأوراق قبل اضافتهم الى مجلد الدراسه ', sid: 155}},
        {inherit: 'stimulus_trial', data: {text: ' انا في الصالون انظر من النافذة الى ساحة البيت      ', sid: 156}},
        {inherit: 'stimulus_trial', data: {text: 'انا اجلس على كرسي بني اللون مع مسند احمر  ', sid: 157}},
        {inherit: 'stimulus_trial', data: {text: 'انا ابني برج من المثلثات بلون  احمر اخضر واصفر  ', sid: 158}},
        {inherit: 'stimulus_trial', data: {text: 'غيمة من الغاز الاسود تاتي لاتجاهي وتلف من حولي   ', sid: 212}},
        {inherit: 'stimulus_trial', data: {text: ' كفات يداي مشتعلتان بالنار والنار تعلو باتجاه راسي ورقبتي  ', sid: 213}},
        {inherit: 'stimulus_trial', data: {text: ' انا انظر بالمراه وارى ان وجهي يتفتت لفتت صغيره    ', sid: 214}},
	{inherit: 'stimulus_trial', data: {text: 'انا رجل عجوز جدا مع شعر ابيض وجلد مترهل     ', sid: 215}},
        {inherit: 'stimulus_trial', data: {text: 'في منتصف الليل انا اصحو لاجد ملاك الموت جانبي   ', sid: 216}},
        {inherit: 'stimulus_trial', data: {text: 'ظل اسود يزحف لتحت سريري ويدخل تحت غطاء نومي    ', sid: 217}},
        {inherit: 'stimulus_trial', data: {text: 'انا اصل الى بيت والداي  واجد مكان البيت انقادا    ', sid: 218}},
        {inherit: 'stimulus_trial', data: {text: 'من خلال ثقب في الجدار يدخل للغرفه عشرات الجرذان ', sid: 219}},
        {inherit: 'stimulus_trial', data: {text: ' شفتاي  ملصقتان بالدبق وانا لا اقدر على فتح فمي       ', sid: 220}},
        {inherit: 'stimulus_trial', data: {text: 'أنا اغمض عيناي وادخل في لعبة كمبيوتر وأقوم بربحها  ', sid: 247}},
        {inherit: 'stimulus_trial', data: {text: 'انا أطير بسرعة في السماء مثل سوبرمان واتجاوز الغيوم  ', sid: 248}},
        {inherit: 'stimulus_trial', data: {text: 'أركز بشدة وأتمكن من رفع كتاب بالهواء بقوة التفكير  ', sid: 249}},
        {inherit: 'stimulus_trial', data: {text: '  ينتظرني خبير تجميل في المنزل ليفعل كل شيء لأجلي  ', sid: 250}},
        {inherit: 'stimulus_trial', data: {text: ' انا أقوم بتكسير سيارة اكثر شخص اكرهه في العالم     ', sid: 251}},
	{inherit: 'stimulus_trial', data: {text: 'يغمى علي وعند استيقاظي اكتشف انني استطيع قراءة  الأفكار   ', sid: 252}},
        {inherit: 'stimulus_trial', data: {text: '  نمت لي  أجنحة ضخمة وانا أطير في السماء الزرقاء ', sid: 253}},
        {inherit: 'stimulus_trial', data: {text: ' يوجد معي عصا سحريه تقوم بتلبية كل  ما اريد     ', sid: 254}},
        {inherit: 'stimulus_trial', data: {text: ' انا افوز بمنافسة ملك جمال العالم لعام الفين وعشرين      ', sid: 281}}
    ]);
   
    /***********************************************
    // Sequence
     ***********************************************/

	API.addSequence([
	    {
		    inherit : {set:"inst_welcome"}
	    },
	    {
	        
			mixer: 'random',
			data: [
				{   
				    
					mixer: 'repeat',
					times: 70,
					data: [
                        {inherit:{set:'scripts', type:'equalDistribution', n: 70, seed:'a'}, data:{block: 'practice'}}
					]
				}
			]
		},
		{
		    inherit : {set:"inst_bye" }
		}
	]);	
	return API.script;
});
