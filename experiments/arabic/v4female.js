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
            inst_welcome : `<p>مرحبا وشكرا على مشاركتكم في بحثنا</p></br>
                            <p>مدة البحث 30 د ستتلقون مقابله 30ش </p>
                            <p>فور انتهاءكم من البحث سنتلقى رسالة حول ذلك ونقوم بتحويل المبلغ الى حسابكم البنكي </p></br>
                            <p> خلال البحث يطلب منكم قراءه وتخيل 70 جمله  </p></br>
                            <p> يعد القراءه الرجاء التخيل انفسكم بالوضع الموصوف في كل جمله ويعد ذلك الضغط على الفراغ </p></br>
                            <p> الجمله تختفي من الشاشه وبعد ذلك يطلب منكم الجواب على 9 اسئله </p></br>                          
                            <p>الاجوبه المناسبه تضغط بواسطة الضغط على لوجة المفاتيح </p></br>
                            <p>يتم تعبئة الاستبيان بشكل مجهول ومخزن بشكل آمن ولا يمكن الوصول إليه إلا للمشاركين في البحث </p></br>
                            <p> اضغط على الفراغ للبدا بالبحث</p>`,
          

            inst_bye     : `<p>انتهت التجربة </p> 
                            <p>سنكون ممتنين لو أجبت على بعض الأسئلة المفتوحة حول التجربة</p>
                            <p>للانتقال إلى الأسئلة ، اضغط على الفراغ  </p>`
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
        Q1          : [{inherit:'defaultStim', media: 'حددي ما  نوع الشعور الذي اتاك من  الجمله عندما تخيلت الوضع الموصوف.اذا كان إيجابي اضغطي   1 واذا كان حيادي اضغطي 2 واذا سلبي اضغطي  3'}],
        Q2          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما هي شدة هذا الشعور ؟1 بلا شعور 9 شعور قوي جدا   '}],    
	    Q3          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما هو احتمال حصول ما ذكر بالجمله لكي ؟1 لا يوجد احتمال 9 احتمال قوي جدا  '}],
        Q4          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما مدى سرعة قفز الوضع الموصوف الى مخيلتكي فور قراءتها ؟1 بطئ جدا 9 سريع جدا '}],      
	    Q5          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 مدى كون الوضع الموصوف في الجمله حي ومفصل  ؟1 ليس حي ولا مفصل 9 حي ومفصل جدا '}],
        Q6          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 كم استهلكتي من الجهد حتى تتوقفي عن التفكير بالوضع الموصوف بالجمله  ؟1 بلاا جهد9 جهد كبير  '}],    
	    Q7          : [{inherit:'defaultStim', media: '  حددي من 1 حتى 9 كم كان الوضع الموصوف في الجمله مرتيط بطموحاتكي ؟1 غير مرتبط بتاتا9 مرتبط جدا  '}],
        Q8          : [{inherit:'defaultStim', media: '  حددي من 1 حتى 9 كم كان الوضع الموصوف في الحمله مرتيط باحتياجاتكي ؟1 غير مرتبط بتاتا9 مرتبط جدا  '}], 
	    Q9          : [{inherit:'defaultStim', media: ' حددي من 1 حتى 9 كم كان الوضع الموصوف في الجمله مرتبط يمخاوفكي؟1 غير مرتبط بتاتا9مرتبط جدا  '}]   
	    
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
        		    {type:'setInput', input:{handle:'q6_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q6_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q6_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q6_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q6_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q6_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q6_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q6_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q6_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q6'},
                ]
            }, 
            
            {
                conditions: [
                    {type:'inputEquals', value:['q6_1', 'q6_2', 'q6_3', 'q6_4', 'q6_5', 'q6_6', 'q6_7', 'q6_8', 'q6_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q7_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q7_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q7_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q7_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q7_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q7_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q7_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q7_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q7_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q7'},
                ]
            }, 
            
            
            {
                conditions: [
                    {type:'inputEquals', value:['q7_1', 'q7_2', 'q7_3', 'q7_4', 'q7_5', 'q7_6', 'q7_7', 'q7_8', 'q7_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q8_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q8_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q8_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q8_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q8_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q8_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q8_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q8_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q8_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q8'},
                ]
            }, 
            
            {
                conditions: [
                    {type:'inputEquals', value:['q8_1', 'q8_2', 'q8_3', 'q8_4', 'q8_5', 'q8_6', 'q8_7', 'q8_8', 'q8_9']}
                ],
                actions: [
                    {type:'hideStim', handle:'All'},
                    {type:'log'},
                    {type:'removeInput', handle:['All']},
        		    {type:'setInput', input:{handle:'q9_1', on: 'keypressed', key: '1'}},
        		    {type:'setInput', input:{handle:'q9_2', on: 'keypressed', key: '2'}},
        		    {type:'setInput', input:{handle:'q9_3', on: 'keypressed', key: '3'}},
        		    {type:'setInput', input:{handle:'q9_4', on: 'keypressed', key: '4'}},
        		    {type:'setInput', input:{handle:'q9_5', on: 'keypressed', key: '5'}},
        		    {type:'setInput', input:{handle:'q9_6', on: 'keypressed', key: '6'}},
        		    {type:'setInput', input:{handle:'q9_7', on: 'keypressed', key: '7'}},
        		    {type:'setInput', input:{handle:'q9_8', on: 'keypressed', key: '8'}},
        		    {type:'setInput', input:{handle:'q9_9', on: 'keypressed', key: '9'}},
                    {type:'resetTimer'},
        		    {type:'showStim', handle: 'Q9'},
                ]
            }, 
            
            {
                conditions: [
                    {type:'inputEquals', value:['q9_1', 'q9_2', 'q9_3', 'q9_4', 'q9_5', 'q9_6', 'q9_7', 'q9_8', 'q9_9']}
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
	        {inherit: 'stimulus_trial', data: {text: ' انا واخوتي نساعد ابي ببناء منزل شجره في حديقتنا  ', sid: 11}},
	        {inherit: 'stimulus_trial', data: {text: 'ابي يستاجر يخت لعائلتنا لكي نحتفل بعيد ميلاد امي ', sid: 12}},
	        {inherit: 'stimulus_trial', data: {text: 'اختي تذهب لولادة طفلها وانا اصبح خاله للمره الأولى ', sid: 13}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أرى اخي الصغير يساعد عجوز على عبور الشارع  ', sid: 14}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم باستلام شهادتي الجامعيه بينما يصفقون لي اهلي واصدقائي   ', sid: 25}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم بإيجاد صورة قديمه لي ولاصدقائي من المرحله الابتدائيه  ', sid: 26}},
	        {inherit: 'stimulus_trial', data: {text: 'من بين جميع الخريجين بقومون بطلبي للعمل بشركه مرموقه ', sid: 27}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اتسوق مع صديقاتي نبحث عن ملابس لتخرجنا الجامعي    ', sid: 28}},
		{inherit: 'stimulus_trial', data: {text: 'بينما انا  اغاضب جدا  اكتشف قدرتي  على التحكم بالنار   ', sid:280}},
	        {inherit: 'stimulus_trial', data: {text: ' افتح علامتي التجاريه الخاصه ويصبح اسمي معروفا في السوق ', sid: 39}},
	        {inherit: 'stimulus_trial', data: {text: ' انا امراه مقتدرة ماليا لذلك اتبرع شهريا بالمال للطلاب ', sid: 40}},
	        {inherit: 'stimulus_trial', data: {text: 'افوز بمسابقه من مكتب السياحه والجائزه سفر مدفوع الاجره ', sid: 41}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أقوم بالتبرع بالاف الدولارات لجمعية حماية حقوق المراه   ', sid: 42}},
	        {inherit: 'stimulus_trial', data: {text: 'صندوق المرضى يخبروننا انهم اخطؤوا بالفحوصات وان امي سليمه   ', sid: 52}},
	        {inherit: 'stimulus_trial', data: {text: 'انظر لبطني وارى ثماني مكعبات رغم عدم ممارستي للتمارين   ', sid: 53}},
	        {inherit: 'stimulus_trial', data: {text: 'انا وصديقتي في طريقنا ذاهبات للمساهمه في التبرع بالدم  ', sid: 54}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم بممارسة اليوغا كل صباح على حافة النهر     ', sid: 67}},
	        {inherit: 'stimulus_trial', data: {text: ' انا أقوم بعزف البيانو في حفله يحضرها موسيقاريون مهمون  ', sid: 68}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اقف وسط المخبز محاطا برائحة الخبز الساخن والحلويات    ', sid: 69}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أقوم باشتمام عطر حبيبي  في حين  احتضانه لي   ', sid: 70}},
	        {inherit: 'stimulus_trial', data: {text: 'اتعرض لحادثه هذا الفصل تجبرني على تمديد سنواتي التعليميه  ', sid: 80}},
	        {inherit: 'stimulus_trial', data: {text: 'اتاخر دقبقه عن اعلاء وظيفتي للمودل  لهذا  لا تحتسب  ', sid: 81}},
	        {inherit: 'stimulus_trial', data: {text: ' اهلي يقطعون عني المصروف بعد سقوطي بالامتحانات هذا الفصل   ', sid: 138}},
	        {inherit: 'stimulus_trial', data: {text: ' والداي يقومان بتعنيف اخي بعد اكتشافهما انه مثلي الجنس  ', sid: 91}},
		{inherit: 'stimulus_trial', data: {text: 'اختي تخلع الحجاب مما يتسبب بعراكات بينها وبين اهلي ', sid: 92}},
	        {inherit: 'stimulus_trial', data: {text: 'والداي يجبرونني على ارتداء الحجاب  ولا استطيع ان ارفض  ', sid: 137}},
	        {inherit: 'stimulus_trial', data: {text: ' اكتشف ان اختي على علاقه غراميه مع تاجر مخدرات  ', sid: 140}},
	        {inherit: 'stimulus_trial', data: {text: ' بعد اتضاح وجود كتل سرطانيه في اثدائي يقومون ببترهم   ', sid: 102}},
	        {inherit: 'stimulus_trial', data: {text: 'امي لديها الزهايمر واحيانا اضتطر لتذكيرها بكيفية تناول الطعام    ', sid: 103}},
	        {inherit: 'stimulus_trial', data: {text: 'صديقتي تطلب ان احمل لها جنينها بعد استئصال رحمها   ', sid: 113}},
	        {inherit: 'stimulus_trial', data: {text: 'بينما أنظف رفي اسقط ذكرى جدتي المتوفاه لي واكسر   ', sid: 114}},
	        {inherit: 'stimulus_trial', data: {text: '      اصارح  يهوديا عن اعجابي به لكنه يشمئز مني لكوني عربيه   ', sid: 124}},
	        {inherit: 'stimulus_trial', data: {text: 'يصعبون لي مقابلة العمل لانهم شركه لا توظف العرب   ', sid: 125}},
	        {inherit: 'stimulus_trial', data: {text: '   انا معلمه لكن الطلاب لا يحترمونني لاني غير محجبه  ', sid: 139}},
	        {inherit: 'stimulus_trial', data: {text: ' جاء دوري للدفع لحانوت الملابس لكن بطاقة ائتماني رفضت ', sid: 135}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اعمل خلال فترة الامتحانات  لكي استطيع شراء الطعام ', sid: 136}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ارسم على الورقه ثلاث مربعات وخمس مثلثات صفراء   ', sid: 195}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ارفع علبة النظارات واقوم بارجاع النظارات الى داخلها   ', sid: 196}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اجمع اقلامي الرصاص  لكي ارجهم الى داخل المقلمه  ', sid: 197}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اشد كابل الكهرباء من القابس لكي اطفا المروحة  ', sid: 198}},
		{inherit: 'stimulus_trial', data: {text: 'انا انحني لكي أقوم بربط رباط حذائي بعد ان فك ', sid: 199}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أقوم بارجاع المسطره الخشبيه الصغيره الى داخل المقلمه  ', sid: 200}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اضع ملابسي في سلة الغسيل لكي اغسلهم لاحقا   ', sid: 201}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اتنقل بين القنوات التلفزيونيه من خلال جهاز التحكم  ', sid:202}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اسرح شعري بالمشط وارجعه الى مكانه بعد انتهاءي    ', sid: 203}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اقوم بتعليق اللوحه على الجدار الابيض فوق سريري   ', sid: 204}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اتفقد الساعه في هاتفي واقوم بارجاعه لجيبي مجددا   ', sid: 205}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اطفأ ضوء الغرفه واغلق الباب بعد خروجي منها     ', sid: 206}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اقوم بايصال الهاتف الى الشاحن وبعدها ادخل الحمام ', sid: 207}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اضع سماعات الاذن واقوم باجراء مكالمه هاتفيه قصيره     ', sid: 208}},
	        {inherit: 'stimulus_trial', data: {text: 'انا افتح قنينة الماء اشرب قليلا ثم اغلقها مجددا  ', sid: 209}},
	        {inherit: 'stimulus_trial', data: {text: ' انا امسح يداي بالمناديل الورقه وثم ارميهم لحاوية النفايات  ', sid: 210}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اقوم بتنشيف يداي بعد ان غسلتهم بالماء والصابون  ', sid: 211}},
	        {inherit: 'stimulus_trial', data: {text: ' انا افصل هاتفي من الشاحن واقوم بارجاعه الى جيبي  ', sid: 192}},
	        {inherit: 'stimulus_trial', data: {text: ' انا ادخل للصندوق زجاجات البلاستيك واضعها بجانب زجاجات الزجاج    ', sid: 194}},
		{inherit: 'stimulus_trial', data: {text: 'أستيقظ في الصباح بجانب شخص غريب يقول إنه زوجي    ', sid: 239}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أكتشف أن لصديقتي العزيزه يوجد طفل من حبيبي   ', sid: 240}},
	        {inherit: 'stimulus_trial', data: {text: ' انا افقد السيطره على نفسي واقوم بضرب طفل رضيع    ', sid: 241}},
	        {inherit: 'stimulus_trial', data: {text: 'أصابعي تتشوه وتتعفن وتسقط واحدة تلو الأخرى    ', sid: 242}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اقرص نفسي في المنام ولكني لا  استطيع الاستيقاظ ', sid: 243}},
	        {inherit: 'stimulus_trial', data: {text: ' أنا مربوطة الجسد ارضا وسكاكين تنزل من السقف لاتجاهي       ', sid: 244}},
	        {inherit: 'stimulus_trial', data: {text: 'انفجر شيطان  من داخل بطني وترك فتحة ضخمة فيه  ', sid: 245}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم بالدعس على يد طفل صغير يحبو واكسرها نهائيا   ', sid: 246}},
	        {inherit: 'stimulus_trial', data: {text: 'في منتصف الليل تفتح السماء فوقي وأرى  الإشراق الإلهي  ', sid: 273}},
	        {inherit: 'stimulus_trial', data: {text: '   لدي كاشف سحري يطلعني على جميع الاجوبه في الامتحانات  ', sid: 274}},
	        {inherit: 'stimulus_trial', data: {text: ' اشارك ببعثه طبيه للعمل على إيجاد علاج لفيروس الكورونا      ', sid: 275}},
		{inherit: 'stimulus_trial', data: {text: 'طبيب العيون يخبرني ان لا  حاجه لارتداءي النظارات بعد الان   ', sid: 276}},
	        {inherit: 'stimulus_trial', data: {text: '  اكتشف ان لدي موهبة عزف الالات الموسيقيه بدون تعلمها  ', sid: 277}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اشتري منزل ضخم يوجد فيه جهاز تحكم صوتي      ', sid: 278}},
	        {inherit: 'stimulus_trial', data: {text: ' عند ملامستي المياه انا حورية بحر وعلى اليابسه  انسانه       ', sid: 279}}
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
                        {inherit:{set:'scripts', type:'equalDistribution', n: 8, seed:'a'}, data:{block: 'practice'}}
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
