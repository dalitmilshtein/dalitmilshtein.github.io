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
                            <p> خلال البحث يطلب منكم قراءه وتخيل 120 جمله  </p></br>
                            <p>  بعد كل جمله يطلب منكم الاجابه على 5 اسئله </p></br>                          
                            <p> الاجوبه المناسبه تسجل بواسطة الضغط على لوحة الارقام </p></br>
                            <p> اضغط على الفراغ في لوحة المفاتيح للبدا بالبحث</p>`,
          

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
       
        Q1          : [{inherit:'defaultStim', media: ' حدد من 1 الى 9 ما هي شدة الشعور الذي انتابك عندما قرات وتخيلت الجملة '}],    
	Q2          : [{inherit:'defaultStim', media: 'حدد من 1 حتى 9 ما هو احتمال حصول ما ذكر بالجملة لك ؟1 لا يوجد احتمال 9 احتمال قوي جدا  '}],           
	Q3          : [{inherit:'defaultStim', media: 'حدد من 1 حتى 9 مدى كون الوضع الذي تخيلته  حي ومفصل  ؟1 ليس حي ولا مفصل 9 حي ومفصل جدا'}],
        Q4          : [{inherit:'defaultStim', media: 'حدد من 1 حتى 9 كم استهلكت من جهد حتى تتوقف عن التفكير بالوضع الموصوف بالجملة  ؟1 بلا جهد9 جهد كبير  '}],    
	Q9          : [{inherit:'defaultStim', media: ' حدد من 1 حتى 9 كم كان الوضع الموصوف في الجملة مرتبط بمخاوفك؟1 غير مرتبط بتاتا9مرتبط جدا  '}]   
	    
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
                actions: [
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
            { media: '<%= trialData.text %>', css:{fontSize: '30px'}, handle:'target', data:{sid:'<%= trialData.sid %>'}}


        ]
    }]);

    /***********************************************
    // Script
     ***********************************************/

    
    
    API.addTrialSet('scripts', [
        {inherit: 'stimulus_trial', data: {text: 'خلال عبوري  نقطة التفتيش جندي يصرخ علي ويهددني ببندقيته ', sid: 1}},
        {inherit: 'stimulus_trial', data: {text: 'انا اهرب من مجموعة شبان يهود يلاحقونني في الشارع ', sid: 2}},
        {inherit: 'stimulus_trial', data: {text: 'انا اجلس بلحافلة وأرى سائق الحافلة العربي يتعرض للضرب ', sid: 3}},
        {inherit: 'stimulus_trial', data: {text: 'يقوم بعض الشباب اليهود بضربي ومن حولنا يصفقون لهم ', sid: 4}},
        {inherit: 'stimulus_trial', data: {text: 'يقوم بعض الشباب اليهود بضربي ومن حولنا يصفقون لهم ', sid: 5}},
        {inherit: 'stimulus_trial', data: {text: 'انا أقوم بأيجاد على باب شقتي كتابات: الموت للعرب ', sid: 6}},
        {inherit: 'stimulus_trial', data: {text: 'يدرك الناس أنني عربي ولا يريدون ألجلوس جانبي بالحافلة ', sid: 7}},
        {inherit: 'stimulus_trial', data: {text: 'أسمع أحدهم يضحك ويقول عني إنني عربي كريه الرائحة  ', sid: 8}},
	{inherit: 'stimulus_trial', data: {text: 'عند مدخل المطار يطلبون خروجنا من السيارة لأننا عرب ', sid:9}},
        {inherit: 'stimulus_trial', data: {text: 'يخبرني طبيب في المشفى أن العرب لديهم  أمراض أكثر', sid: 10}},
        {inherit: 'stimulus_trial', data: {text: 'سائق سيارة الأجرة يرفض ان يقلني بسبب كوني عربي  ', sid: 11}},
        {inherit: 'stimulus_trial', data: {text: 'يكتشف صاحب المنزل أنني عربي ويطلب مني مغادرة الشقة  ', sid: 12}},
        {inherit: 'stimulus_trial', data: {text: 'يمنعونني من دخول النادي الليلي مع أصدقائي لأنني عربي ', sid: 13}},
        {inherit: 'stimulus_trial', data: {text: 'أوقفني شرطي ليلاً في الشارع ويطالب برؤية بطاقة الهوية', sid: 14}},
        {inherit: 'stimulus_trial', data: {text: 'القنصلية الأمريكية لا تريد منحي بطاقة ائتمان لأنني عربي', sid: 15}},
        {inherit: 'stimulus_trial', data: {text: 'في المقهى يسمعني الناس أتكلم العربية فيقومون بتغيير طاولتهم', sid: 16}},
        {inherit: 'stimulus_trial', data: {text: 'اقول في مقابلة عمل انني عربي وإذ بهم يطردونني', sid: 17}},
        {inherit: 'stimulus_trial', data: {text: 'اكتشف أن العاملين اليهود  معي يكسبون ضعف ما اكسبه', sid: 18}},
        {inherit: 'stimulus_trial', data: {text: ' انا أخبر والداي أن صديقتي يهودية وإذ بهما ينصدمان', sid: 19}},
        {inherit: 'stimulus_trial', data: {text: 'أصبح والداي  اكثر تدينا  ويطالباني بالذهاب للمسجد كل أسبوع', sid: 20}},
        {inherit: 'stimulus_trial', data: {text: ' أسمع بمنزل عمي طلقات نارية وصراخ بسبب قضية ثأر ', sid: 21}},
        {inherit: 'stimulus_trial', data: {text: 'والداي يمنعانني من ابطال خطوبتي خوفا مما سيقوله الناس', sid: 22}},
        {inherit: 'stimulus_trial', data: {text: ' يجبرونني على زواج  فتاة بعد ان شوهدت وانا اقبلها', sid: 23}},
        {inherit: 'stimulus_trial', data: {text: ' أبي يسمع  أختي تتحدث عن نزيفها في الدورة الشهرية', sid: 24}},
	{inherit: 'stimulus_trial', data: {text: ' والداي يطردانني من المنزل لأنهما سمعا أنني مارست الجنس', sid: 25}},
        {inherit: 'stimulus_trial', data: {text: 'يمنعني والداي من ان ارتدي السراويل القصيرة خارج المنزل', sid: 26}},
        {inherit: 'stimulus_trial', data: {text: ' يمنعني والداي من البدء بالدراسة الجامعية قبل بناء منزل', sid: 27}},
        {inherit: 'stimulus_trial', data: {text: 'يمنعني والداي  حضور زفاف يتواجد فيه الرجال والنساء معًا', sid: 28}},
        {inherit: 'stimulus_trial', data: {text: 'يحاولون اجباري بمقابلة ابنة عمي من اجل التعارف للزفاف', sid: 29}},
        {inherit: 'stimulus_trial', data: {text: 'أستيقظ  ليلا على صوت إطلاق النار في  زفاف جيراننا', sid: 30}},
        {inherit: 'stimulus_trial', data: {text: 'أجلس بمحطة الحافلات ليلا  وتحيط بي مجموعة من العرب', sid: 31}},
        {inherit: 'stimulus_trial', data: {text: 'دخلت بالخطأ الى قرية عربية فبدأو بالهجوم على سيارتي', sid: 32}},
        {inherit: 'stimulus_trial', data: {text: 'أستيقظ في الليل وأرى عربيًا يقتحم المنزل ويقترب مني', sid: 33}},
        {inherit: 'stimulus_trial', data: {text: 'ادخل وسط تبادل اطلاق رصاص لمجرمين عرب وأحاول الاختباء ', sid: 34}},
        {inherit: 'stimulus_trial', data: {text: 'أنا أرى مجموعة من الأولاد العرب يغتصبون فتاة صغيرة', sid: 35}},
        {inherit: 'stimulus_trial', data: {text: 'سيارة يقودها سائق عربي تسير بعنف ووحشية وتصطدم بسيارتي ', sid: 36}},
        {inherit: 'stimulus_trial', data: {text: 'اتى عرب لسكن  الشقة المجاورة ويوجد صراخ طوال الوقت', sid: 37}},
        {inherit: 'stimulus_trial', data: {text: 'اكتشف أن الفتاة التي أواعدها منذ فترة طويلة  عربية', sid: 38}},
        {inherit: 'stimulus_trial', data: {text: 'والداي في حالة صدمة لأنني اخبرهما إنني صديق لعربي', sid: 39}},
        {inherit: 'stimulus_trial', data: {text: 'دخلت الفصل ولا يوجد سوى طلاب عرب يتحدثون العربية', sid: 40}},
	{inherit: 'stimulus_trial', data: {text: 'أجلس في سيارة أجرة وإذ بالسائق يتحدث بالهاتف بالعربية', sid: 41}},
	{inherit: 'stimulus_trial', data: {text: 'أمشي في الشارع وعربي أمامي يسحب سكينًا ويركض باتجاهي', sid: 42}},   
	{inherit: 'stimulus_trial', data: {text: 'يبلغونني عبر الهاتف أن أعز أصدقائي قُتل في الهجوم', sid: 43}},   
        {inherit: 'stimulus_trial', data: {text: 'عربي كبير يرتدي كوفية يهجم علي ويصرخ: الله أكبر', sid: 44}},
        {inherit: 'stimulus_trial', data: {text: 'أقف أمام  منزل والديّ المدمر بواسطة قذيفة من غزة', sid: 45}},
        {inherit: 'stimulus_trial', data: {text: ' متحدث في تجمع طلابي يقول  الجنود الإسرائيليين مجرمو حرب', sid:46}},
        {inherit: 'stimulus_trial', data: {text: 'انا جندي مبتدئ بالجيش والعرب يرمون علينا حجاة ويلعنوننا ', sid: 47}},
        {inherit: 'stimulus_trial', data: {text: 'انا أكتشف أن صديقي العربي يدعم الإرهاب ضد اليهود', sid: 48}},
        {inherit: 'stimulus_trial', data: {text: 'أرى في التلفزيون  حماسي يتحدث عن القضاء على  إسرائيل', sid: 49}},
        {inherit: 'stimulus_trial', data: {text: 'يخبرني جدي إن شقيقه قُتل في المحرقة بغرفة الغاز', sid: 50}},
        {inherit: 'stimulus_trial', data: {text: 'أنا في معسكر اعتقال في المحرقة ويجبرونني البقاء عاريا', sid: 51}},
        {inherit: 'stimulus_trial', data: {text: ' انا اتجول خارج البلاد وأرى على الجدران: الموت لليهود', sid: 52}},
        {inherit: 'stimulus_trial', data: {text: 'أنا عند مقهى خارج البلاد  ومكتوب  لا مدخل للإسرائيليين', sid: 53}},
        {inherit: 'stimulus_trial', data: {text: 'انا أرى على موقع فيسبوك صورة ليهودي بوجه فأر', sid: 54}},
        {inherit: 'stimulus_trial', data: {text: 'القنصلية الأمريكية لا تسمح بمنحني بطاقة ائتمان لأنني مستوطن', sid: 55}},
        {inherit: 'stimulus_trial', data: {text: 'اكتشف أنهم نشروا صوري بالفيسبوك مع تسميتي يهودي سارق', sid: 56}},
	{inherit: 'stimulus_trial', data: {text: 'أنا يهودي محافظ على التقاليد واللحوم والجبن عالقة بفمي', sid: 57}},    
        {inherit: 'stimulus_trial', data: {text: ' يخبرني طلاب  امريكيون باعتقادهم أن اليهود يشربون دماء الأطفال', sid: 58}},
	{inherit: 'stimulus_trial', data: {text: 'أرى حاخامًا يهوديًا يضرب حتى الموت من النازيين الجدد', sid: 59}},
        {inherit: 'stimulus_trial', data: {text: 'عند مغادرتي احد الفنادق أُتهم بأنني لص يهودي  إسرائيلي', sid: 60}},
        {inherit: 'stimulus_trial', data: {text: 'اتلقى بريد الكتروني  عن توقيف تعليمي  بسبب علاماتي المنخفضه', sid: 61}},
        {inherit: 'stimulus_trial', data: {text: 'محاضري الجامعي يحاول ان يغتصبني بعد ان قمت برفضه', sid: 62}},
        {inherit: 'stimulus_trial', data: {text: ' انا اغفو بالقطار وتسرق حقيبتي اللتي تحتوي حاسوبي النقال', sid: 63}},
        {inherit: 'stimulus_trial', data: {text: ' بعد مجهودي الكبير بالمهمة يخبرني محاضري أنها سيئة جدا', sid: 64}},
        {inherit: 'stimulus_trial', data: {text: 'كومبيوتري النقال يسقط ويكسر بعد ان قام احد بدفعي', sid: 65}},
        {inherit: 'stimulus_trial', data: {text: '  محاضري  يقف خلفي يسترق السمع بينما أقوم بالسخرية منه', sid: 66}},
        {inherit: 'stimulus_trial', data: {text: 'تلقيت بريدًا إلكترونيًا بخصوص رسوبي بلامتحان وبفصلي من القسم', sid: 67}},
        {inherit: 'stimulus_trial', data: {text: 'انا اركل الصندوق واجد فيه قطة ماتت من الركلة', sid: 68}},
        {inherit: 'stimulus_trial', data: {text: 'امي تخبرني ان لديها كتل سرطانيه منتشره بانحاء جسدها', sid: 69}},
	{inherit: 'stimulus_trial', data: {text: 'انا انتظر مع ابي في المشفى لتلقيه العلاج الكيميائي', sid: 70}},
        {inherit: 'stimulus_trial', data: {text: 'أنظر للهاتف أثناء القيادة وأفقد السيطرة وتصاب أمي بشدة', sid: 71}},
        {inherit: 'stimulus_trial', data: {text: 'آتناول لقمة من الشطيرة واجد  صرصورا في داخل فمي', sid: 72}},
        {inherit: 'stimulus_trial', data: {text: 'انا افقد السيطره على نفسي واقوم بضرب طفل رضيع', sid: 73}},
        {inherit: 'stimulus_trial', data: {text: 'انا اتنقل بواسطة كرسي متحرك بسبب شلل في قدماي', sid: 74}},
        {inherit: 'stimulus_trial', data: {text: 'أذهب إلى الفراش وأجد بقعًا ملطخة بالفضلات على الملاءة', sid: 75}},
        {inherit: 'stimulus_trial', data: {text: 'انا اجلس بمفردي في عيد ميلادي انتظر ان  يتصل بي احدهم', sid: 76}},
        {inherit: 'stimulus_trial', data: {text: ' أرى من نافذتي اولادا يحاولون حرق قطه داخل صندوق', sid: 77}},
        {inherit: 'stimulus_trial', data: {text: 'ادخل المشفى والجميع يبتعدون عني بسبب إصابتي بفيروس كورونا', sid: 78}},
        {inherit: 'stimulus_trial', data: {text: 'بُترت خصيتيَّ بعد أن كشف وجد أورام سرطانية بداخلي', sid: 79}},
        {inherit: 'stimulus_trial', data: {text: 'امي لديها الزهايمر واحيانا اضطر لتذكيرها بكيفية تناول الطعام', sid: 80}},
        {inherit: 'stimulus_trial', data: {text: ' انا اقف خلف الباب واسمع أصدقائي يقومون بالسخرية مني', sid: 81}},
	{inherit: 'stimulus_trial', data: {text: ' أنا اكتشف ان فتاة احبها وصديقي المقرب سيقومون بالزواج', sid: 82}},
        {inherit: 'stimulus_trial', data: {text: 'انا أقوم بزيارة ابي الذي كبر ولا يقوم بتذكري ', sid: 83}},
        {inherit: 'stimulus_trial', data: {text: 'انا اسمع بالصدفة اصدقائي يخططون للسفر ولا يقومون باخباري ', sid: 84}},
        {inherit: 'stimulus_trial', data: {text: 'أثناء مقابلة العمل يقومون بالسخرية  مني لأني أبدو متدينًا ', sid: 85}},
        {inherit: 'stimulus_trial', data: {text: 'حبيبتي تنفصل عني لاني اردت علاقة جنسية قبل الزواج', sid: 86}},
        {inherit: 'stimulus_trial', data: {text: 'انا اصارح  فتاة عن اعجابي بها لكنها تشمئز مني ', sid: 87}},
        {inherit: 'stimulus_trial', data: {text: 'أسير بالشارع تحت المطر وأرى عجوزا يرتجف على مقعد', sid: 88}},
        {inherit: 'stimulus_trial', data: {text: 'احدهم يأكل بجواري ويبصق بالخطأ كتلة من البلغم لصحني ', sid: 89}},
        {inherit: 'stimulus_trial', data: {text: 'انا في امتحان ولا أتذكر كلمه مما قد درست', sid: 90}},
        {inherit: 'stimulus_trial', data: {text: 'محاضرتي الجامعيه تحاول ان تغتصبني بعد ان قمت برفضها ', sid: 91}},
        {inherit: 'stimulus_trial', data: {text: ' انا اغفو بالقطار وتسرق حقيبتي اللتي تحتوي حاسوبي النقال    ', sid: 92}},
        {inherit: 'stimulus_trial', data: {text: 'جدي يقوم بتعنيفي امام والداي وهم لا يحركون ساكنا  ', sid: 93}},
        {inherit: 'stimulus_trial', data: {text: 'امي تخبرني ان لديها كتل سرطانيه منتشره بانحاء جسدها  ', sid: 94}},
        {inherit: 'stimulus_trial', data: {text: 'انا انتظر مع ابي في المشفى لتلقيه العلاج الكيميائي ', sid: 95}},
        {inherit: 'stimulus_trial', data: {text: ' انا ارى علامه موجبه على فاحص  حمل لاختي العزباء   ', sid: 96}},
        {inherit: 'stimulus_trial', data: {text: ' في حين تجولي خارجا اسمع صوت صافرات وذوي انفجار   ', sid: 97}},
	{inherit: 'stimulus_trial', data: {text: 'بسبب جرح لم اعاينه في يدي سيقومون بقطعها كليا  ', sid: 98}},
        {inherit: 'stimulus_trial', data: {text: 'انتهى اليوم ولم اتلقى اي تهنئه بمناسبة عيد ميلادي ', sid: 99}},
        {inherit: 'stimulus_trial', data: {text: ' انا اقف خلف الباب واسمع أصدقائي يقومون بالسخرية مني ', sid: 100}},
        {inherit: 'stimulus_trial', data: {text: 'بسبب ازديادي  بالوزن لا اقدر على غلق زر بنطالي  ', sid: 101}},
        {inherit: 'stimulus_trial', data: {text: 'عجوز يتجاوزني في الطابور معلقا ان لا مكان لعربي هنا    ', sid: 102}},
        {inherit: 'stimulus_trial', data: {text: 'اذهب للملجا بعد سماع الصافرات واليهود لا يقومون بادخالي   ', sid: 103}},
        {inherit: 'stimulus_trial', data: {text: 'بعد ان تخرجت بامتياز لا يوظفونني بسبب كوني عربيا   ', sid: 104}},
        {inherit: 'stimulus_trial', data: {text: '      انا ادخل يدي الى جيبي ولا اجد الشيك فيها   ', sid: 105}},
        {inherit: 'stimulus_trial', data: {text: 'اكتشف اني القيت للنفايات المال الذي اعطتني إياه امي  ', sid: 106}},
        {inherit: 'stimulus_trial', data: {text: '    اكتشف ان المال اللذي وفرته جانبا للسفر قد سرق ', sid: 107}},
        {inherit: 'stimulus_trial', data: {text: 'انا اقوم بتغليف رزمة ورق واضعهم في داخل الصناديق ', sid: 108}},
        {inherit: 'stimulus_trial', data: {text: ' انا ادخل الصف واجلس على كرسيي منتظرا حضور المحاضر ', sid: 109}},
        {inherit: 'stimulus_trial', data: {text: 'انتظر ثلاث دقائق حتى يسخن الماء في المسخن الكهربائي   ', sid: 110}},
        {inherit: 'stimulus_trial', data: {text: 'انا اسمع صوت الناس يتهامسون في الغرفه المجاوره الي   ', sid: 111}},
        {inherit: 'stimulus_trial', data: {text: 'أقوم بإزالة الغطاء عن العلبه وارميه في سلة القمامه  ', sid: 112}},
        {inherit: 'stimulus_trial', data: {text: 'انا انعطف لليمين اعبر من خلف الحديقه نحو البيت   ', sid: 113}},
	{inherit: 'stimulus_trial', data: {text: 'أقوم بشغيل الجهاز بعد ان قرات التعليمات حول استخدامه ', sid: 114}},
	{inherit: 'stimulus_trial', data: {text: 'أقوم بشغيل الجهاز بعد ان قرات التعليمات حول استخدامه ', sid: 115}},   
	{inherit: 'stimulus_trial', data: {text: 'أقوم بشغيل الجهاز بعد ان قرات التعليمات حول استخدامه ', sid: 116}},   
        {inherit: 'stimulus_trial', data: {text: 'أقوم بوضع اشاره الى اين وصلت في الكتاب واغلقه ', sid: 117}},
        {inherit: 'stimulus_trial', data: {text: 'انا ادخل الى الصالون واعبر منه الى الشرفه الاماميه  ', sid: 118}},
        {inherit: 'stimulus_trial', data: {text: 'انا اضع اللاصقات على الكتب وارتبهم على رف المكتبه   ', sid: 119}},
        {inherit: 'stimulus_trial', data: {text: 'انا افتح خزانة المطبخ لكي اتناول ملعقة طعام وصحن    ', sid: 120}},
       
       
       
       
       
       
       
       
       
       
       
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
					times: 120,
					data: [
                        {inherit:{set:'scripts', type:'equalDistribution', n: 120, seed:'a'}, data:{block: 'practice'}}
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
