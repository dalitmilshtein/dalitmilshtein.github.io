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
        Q1          : [{inherit:'defaultStim', media: 'حددي ما  نوع الشعور الذي اتاكي من  الجمله عندما تخيلتي الوضع الموصوف.اذا كان إيجابي اضغطي   1 واذا كان حيادي اضغط 2 واذا سلبي اضغط  3'}],
        Q2          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما هي شدة هذا الشعور ؟1 بلا شعور 9 شعور قوي جدا   '}],    
	    Q3          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما هو احتمال حصول ما ذكر بالجمله لكي ؟1 لا يوجد احتمال 9 احتمال قوي جدا  '}],
        Q4          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما مدى سرعة قفز الوضع الموصوف الى مخيلتكي فور قراءتها ؟1 بطئ جدا 9 سريع جدا '}],      
	    Q5          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 مدى كون الوضع الموصوف في الجمله حي ومفصل  ؟1 ليس حي ولا مفصل 9 حي ومفصل جدا '}],
        Q6          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 كم استهلكت من الجهد حتى تتوقفي عن التفكير بالوضع الموصوف بالجمله  ؟1 بلاا جهد9 جهد كبير  '}],    
	    Q7          : [{inherit:'defaultStim', media: '  حددي من 1 حتى 9 كم كان الوضع الموصوف في الحمله مرتيط بطموحاتكي ؟1 غير مرتبط بتاتا9 مرتبط جدا  '}],
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
	        {inherit: 'stimulus_trial', data: {text: 'والداي احضروا لي تذكرة لحفل الفرقه الموسيقيه الاحب لي ', sid: 7}},
	        {inherit: 'stimulus_trial', data: {text: 'انا في المطار متجهه مع ابي الى جزر المالديف ', sid: 8}},
	        {inherit: 'stimulus_trial', data: {text: ' والداي يبدون موافقتهم  على زواجي من الرجل اللذي احب ', sid: 9}},
	        {inherit: 'stimulus_trial', data: {text: 'يتم ترشيح امي لمنصب اكثر امراه تاثيرا لهذا العام ', sid: 10}},
	        {inherit: 'stimulus_trial', data: {text: 'انا احصل على علامه ممتازه  بامتحان القبول للقب الثاني   ', sid: 18}},
	        {inherit: 'stimulus_trial', data: {text: 'بعد انهاء عرض بحثي وقف جميع الطلاب تسفيقا لي   ', sid: 19}},
	        {inherit: 'stimulus_trial', data: {text: 'انا انهي الامتحان الأخيرلهذا الفصل وكل اجوبتي صحيحه   ', sid: 20}},
	        {inherit: 'stimulus_trial', data: {text: 'المحاضر يعلن للجميع اني التلميذ الالمع من بين تلاميذه    ', sid: 21}},
		{inherit: 'stimulus_trial', data: {text: 'انا اجمع النقود لكي اسافر مع أصدقائي لرحله صيفيه   ', sid:35}},
	        {inherit: 'stimulus_trial', data: {text: ' اجد في طريق العوده الى البيت محفظه مليئه بالنقود  ', sid: 36}},
	        {inherit: 'stimulus_trial', data: {text: 'بعد استثماري الأخير أصبحت غنيه وقمت بشراء مركب لي ', sid: 37}},
	        {inherit: 'stimulus_trial', data: {text: ' حصلت على ترقيه من مدير عملي وأصبحت رئيسه القسم   ', sid: 38}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أشارك في حفل تنكري هدفه اسعاد مرضى السرطان    ', sid: 49}},
	        {inherit: 'stimulus_trial', data: {text: 'بعد عملي المكثف انا انجح بايجاد علاج لمرض السكري  ', sid: 50}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اتطوع اربع ساعات اسبوعيه لاسعاد أطفال مرضى السرطان   ', sid: 51}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اتمشى مع رفيقي في موعدنا الأول ممسكي اليدين    ', sid: 63}},
	        {inherit: 'stimulus_trial', data: {text: 'انا واصدقائي نقوم بالتخييم في الصحراء تحت النجوم    ', sid: 64}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ارتدي فستانا جذاب والجميع  في الحفله ينظرون لي  ', sid: 65}},
	        {inherit: 'stimulus_trial', data: {text: ' أقوم بتلقي مديح من مدير عملي امام جميع العاملين     ', sid: 66}},
	        {inherit: 'stimulus_trial', data: {text: 'كومبيوتري النقال يسقط ويكسر بعد ان قامم احد بدفعي', sid: 77}},
	        {inherit: 'stimulus_trial', data: {text: 'بينما اسخر عن محاضري هو يقف خلفي يسترق السمع  ', sid: 78}},
	        {inherit: 'stimulus_trial', data: {text: 'لا اخوض الامتحانات هذا الفصل بسبب كسر في يدي ', sid: 79}},
	        {inherit: 'stimulus_trial', data: {text: ' اعود متاخره ليلا الى البيت واخي يقوم بالتهجم علي  ', sid: 88}},
	        {inherit: 'stimulus_trial', data: {text: ' اخي بجانبي يشرح لي باكيا مرتجفا انه مثلي الجنس   ', sid: 89}},
		{inherit: 'stimulus_trial', data: {text: 'ابي يرغمني على الزواج بصديقه الاربعيني وامي تدعمه بذلك ', sid: 90}},
	        {inherit: 'stimulus_trial', data: {text: 'نا اصرخ  لان يداي تحترقان لكن لا احد يسمعني ', sid: 99}},
	        {inherit: 'stimulus_trial', data: {text: '  رمال  متحركه تمتصني وجميع من حولي يرى  لكن  يتجاهلني ', sid: 100}},
	        {inherit: 'stimulus_trial', data: {text: 'ادخل المشفى والجميع يبتعدون عني بسبب إصابتي بفيروس معدي  ', sid: 101}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم برؤية صور حميميه لي بالانستجرام مع تعليقات واعجابات   ', sid: 110}},
	        {inherit: 'stimulus_trial', data: {text: ' اقوم بالاستيقاظ بالصباح بجانب رجل غريب يخبرني انه زوجي   ', sid: 111}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم باضاعة هاتفي النقال اثناء سفري ولا أجده مجددا  ', sid: 112}},
	        {inherit: 'stimulus_trial', data: {text: '     وصلت الى البركة لكني  أرى لافته تمنع دخول العرب   ', sid: 121}},
	        {inherit: 'stimulus_trial', data: {text: 'لا يدخلونني للنادي الليلي لاعتقادهم بانني عربيه وسافتعل المشاكل    ', sid: 122}},
	        {inherit: 'stimulus_trial', data: {text: '   حبيبي يقوم بالاتفصال عني لاني ضد العلاقات قبل الزواج ', sid: 123}},
	        {inherit: 'stimulus_trial', data: {text: 'انتظر دوري للدفع للحافله واكتشف ان ليس معي نقودا ', sid: 132}},
	        {inherit: 'stimulus_trial', data: {text: ' انا في رحله جامعيه اضعت محفظتي التي تحتوي مصروفي ', sid: 133}},
	        {inherit: 'stimulus_trial', data: {text: 'قترب موعد سد القرض البنكي وليس معي المبلغ الكافي   ', sid: 134}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اخطو خمس خطوات للامام قبل ان التف شمالا    ', sid: 177}},
	        {inherit: 'stimulus_trial', data: {text: 'انا انظر الى الرجل يغلق نافذة السياره ويقوم بتشغيلها   ', sid: 178}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اسال السكرتيره عن مواعيد عمل المكتب أيام الأسبوع    ', sid: 179}},
		{inherit: 'stimulus_trial', data: {text: 'انا اكتب على الدفتر جمل بالعربيه وارجع القلم للمقلمه ', sid: 180}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اوزع لكل واحد من اللاعبين بطاقات بالوان مختلفه ', sid: 181}},
	        {inherit: 'stimulus_trial', data: {text: 'انا احضر ثلاثة رفوف بالوان ملابس مختلفه داخل الخزانه   ', sid: 182}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اضع اللاصقات على الكتب وارتبهم على رف المكتبه   ', sid:183}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اخطط في دفتري عواميد بلون  زهري واحمر    ', sid: 184}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اضع مكعبات بجميع الألوان على طاوله خشبيه مدوره   ', sid: 185}},
	        {inherit: 'stimulus_trial', data: {text: 'انا الف الكرسي باتجاه الطاوله وارتب عليها أدوات الطعام  ', sid: 186}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اصنع ثقوب داخل الكرتونه لكي ادخل الخيوط فيها      ', sid: 187}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اضع المغلف داخل الدرج تحت الأوراق الموجوده فيه ', sid: 188}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اتفقد وجود أوراق فارغه داخل الدفتر صالحه للاستعمال      ', sid: 189}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ارفع حقيبتي عن الأرض واضعها على سطح المكتب  ', sid: 190}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اتفقد الرسائل في بريدي الالكتروني من خلال حاسوبي   ', sid: 191}},
	        {inherit: 'stimulus_trial', data: {text: ' بينما اعبر الشارع سياره مسرعه تصدمني وترفعني في الهواء   ', sid: 230}},
	        {inherit: 'stimulus_trial', data: {text: ' يوجد لدي ذيل  لذلك انا لا استطيع  ارتداء بنطالي ', sid: 231}},
	        {inherit: 'stimulus_trial', data: {text: ' احاول التكلم لكن يخرج من فمي لعاب وليس كلمات     ', sid: 232}},
		{inherit: 'stimulus_trial', data: {text: ' انا اسبح لوحدي بالبحر ولا استطيع الوصول الى الشاطئ     ', sid: 233}},
	        {inherit: 'stimulus_trial', data: {text: 'لحظة اصطدامي  بشاب سببت له كدمه  كبيره في يده   ', sid: 234}},
	        {inherit: 'stimulus_trial', data: {text: 'ابي وامي يقومون باخباري  انهم تبنوني عندما كنت طفله    ', sid: 235}},
	        {inherit: 'stimulus_trial', data: {text: 'أمشي في الشارع عبر عاصفة قوية وفجأة يصيبني البرق    ', sid: 236}},
	        {inherit: 'stimulus_trial', data: {text: 'مجموعة كلاب تلحق بي في الظلام  والمسافه بيننا تتقلص ', sid: 237}},
	        {inherit: 'stimulus_trial', data: {text: '  دبور يقوم بالدخول  الى أنفي ويلسعني في داخل رأسي       ', sid: 238}},
	        {inherit: 'stimulus_trial', data: {text: '  يستمع لي الاف الناس باصغاء بينما أتكلم في المظاهرة  ', sid: 264}},
	        {inherit: 'stimulus_trial', data: {text: 'استيقظ في الصباح وأكتشف أنه أصبح لي  قوى  خارقه    ', sid: 265}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم بتلقي رسالة اعجاب من شاب قد اعجبني مطولا  ', sid: 266}},
	        {inherit: 'stimulus_trial', data: {text: '  أستيقظ في الصباح وأجد نفسي في قصر  انا مالكته  ', sid: 267}},
	        {inherit: 'stimulus_trial', data: {text: ' أشرب مشروبًا سحريًا وأشعر كيف أصبحت شابة إلى الأبد    ', sid: 268}},
		{inherit: 'stimulus_trial', data: {text: 'اقوم بالدعاء لامي بان تتحسن وتشفى وإذ بالدعاء يتحقق   ', sid: 269}},
	        {inherit: 'stimulus_trial', data: {text: '  افوز  باللعبة بالماس  وإذ به يسقط من الشاشة الي ', sid: 270}},
	        {inherit: 'stimulus_trial', data: {text: ' انا احرر  من السجن واخرج  نحو الشمس المشرقة والحرية    ', sid: 271}},
	        {inherit: 'stimulus_trial', data: {text: ' انا أركض بسرعة حتى ان انشقت قدماي وقمت بالطيران     ', sid: 272}}
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
