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
        Q1          : [{inherit:'defaultStim', media: 'حددي ما  نوع الشعور الذي اتاكي من  الجمله عندما تخيلت الوضع الموصوف.اذا كان إيجابي اضغطي   1 واذا كان حيادي اضغطي 2 واذا سلبي اضغطي  3'}],
        Q2          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما هي شدة هذا الشعور ؟1 بلا شعور 9 شعور قوي جدا   '}],    
	    Q3          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما هو احتمال حصول ما ذكر بالجمله لكي ؟1 لا يوجد احتمال 9 احتمال قوي جدا  '}],
        Q4          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 ما مدى سرعة قفز الوضع الموصوف الى مخيلتكي فور قراءتها ؟1 بطئ جدا 9 سريع جدا '}],      
	    Q5          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 مدى كون الوضع الموصوف في الجمله حي ومفصل  ؟1 ليس حي ولا مفصل 9 حي ومفصل جدا '}],
        Q6          : [{inherit:'defaultStim', media: 'حددي من 1 حتى 9 كم استهلكت من الجهد حتى تتوقفي عن التفكير بالوضع الموصوف بالجمله  ؟1 بلاا جهد9 جهد كبير  '}],    
	    Q7          : [{inherit:'defaultStim', media: '  حددي من 1 حتى 9 كم كان الوضع الموصوف في الحمله مرتيط بطموحاتكي ؟1 غير مرتبط بتاتا9 مرتبط جدا  '}],
        Q8          : [{inherit:'defaultStim', media: '  حددي من 1 حتى 9 كم كان الوضع الموصوف في الحمله مرتيط باحتياجاتكي ؟1 غير مرتبط بتاتا9 مرتبط جدا  '}], 
	    Q9          : [{inherit:'defaultStim', media: ' حددي من 1 حتى 9 كم كان الوضع الموصوف في الجمله مرتبط بمخاوفكي؟1 غير مرتبط بتاتا9مرتبط جدا  '}]   
	    
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
	        {inherit: 'stimulus_trial', data: {text: 'أقوم بالسباحه في البحيره مغمضة العينين واسمع  خفيف الأشجار  ', sid: 60}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اجلس مع حبيبي امام المدفئه ونحتسي الشوكولا الساخنه ', sid: 61}},
	        {inherit: 'stimulus_trial', data: {text: 'انا جالس في السينما وبجانبي حبيبي يجاول التودد الي ', sid: 62}},
	        {inherit: 'stimulus_trial', data: {text: 'استيقظ متاخره عشرة دقائق للامتحان الذي درست له اسبوعان ', sid: 74}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اقف لعرض مشروعي امام الصف ولا أتذكر أي شيء  ', sid: 75}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أقوم باحتضان اخي الصغير واعده اني ساسانده دائما  ', sid: 4}},
	        {inherit: 'stimulus_trial', data: {text: 'انا وامي نحتسي الشاي سويا في ليله صيفيه هادئه  ', sid: 5}},
	        {inherit: 'stimulus_trial', data: {text: 'انا وابي نحمل صناره ودلو وفي طريقنا لاصطياد الأسماك   ', sid: 6}},
		{inherit: 'stimulus_trial', data: {text: 'انا احصل على علامه ممتازه  بامتحان القبول للقب الثاني  ', sid:18}},
	        {inherit: 'stimulus_trial', data: {text: 'بعد انهاء عرض بحثي وقف جميع الطلاب تسفيقا لي  ', sid: 19}},
	        {inherit: 'stimulus_trial', data: {text: 'انا انهي الامتحان الأخيرلهذا الفصل وكل اجوبتي صحيحه  ', sid: 20}},
	        {inherit: 'stimulus_trial', data: {text: 'أعثر في جيبي على مبلغ مال كنت قد نسيته  ', sid: 32}},
	        {inherit: 'stimulus_trial', data: {text: 'يتصلون بي لاخباري اني ربحت سياره وانا ذاهب لاستلامها    ', sid: 33}},
	        {inherit: 'stimulus_trial', data: {text: 'أصدقائي يرغمونني على المشاركه بورقة يانصيب و افوز بمبلغ ضخم   ', sid: 34}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اتلقى جواب إيجابي من فحوصاتي الطبيه عن الايدز    ', sid: 46}},
		{inherit: 'stimulus_trial', data: {text: 'يقومون باخباري بتلقيي جائزه عقب اكتشافي لعلاج لمرض السرطان     ', sid: 47}},
	        {inherit: 'stimulus_trial', data: {text: 'اكتشف ان فقره قصيره كتبتها بفيسبوك تحظى  بآلاف الإعجابات  ', sid: 263}},
	        {inherit: 'stimulus_trial', data: {text: 'افوم بكتابه اخر سطر من الكتاب المؤلف عن حياتي    ', sid: 59}},
	        {inherit: 'stimulus_trial', data: {text: 'بعد ان عملت على الوظيفه شهرا اتلقى علامة سقوط ', sid: 76}},
	        {inherit: 'stimulus_trial', data: {text: ' قوم بجر امي على كرسي متحرك ما بعد الحادثه التي تسببتها    ', sid: 85}},
	        {inherit: 'stimulus_trial', data: {text: 'اكتشف ان اخي الصغير يقوم بتوزيع المخدرات لاولاد المدارس  ', sid: 86}},
	        {inherit: 'stimulus_trial', data: {text: 'ابي واخي يتشاجرون وفي منتصف الشجار اخي يضرب ابي  ', sid: 87}},
	        {inherit: 'stimulus_trial', data: {text: ' أرى من نافذتي اولادا يحاولون حرق قطه داخل صندوق ', sid: 96}},
	        {inherit: 'stimulus_trial', data: {text: ' انا أقوم بدهس قطه اثناء سياقتي بسبب انشغالي بالهاتف  ', sid: 97}},
	        {inherit: 'stimulus_trial', data: {text: ' أرى ولدا يغرق ولا اساعده لاني لا اعرف السباحه   ', sid: 98}},
		{inherit: 'stimulus_trial', data: {text: '  بعد علاقه غراميه دامت لسنوات يقوم بالانفصال عني  ', sid: 107}},
	        {inherit: 'stimulus_trial', data: {text: ' أقوم باكتشاف وجود علاقه غراميه بين حبيبي السابق وصديقتي ', sid: 108}},
	        {inherit: 'stimulus_trial', data: {text: '  صديقتي تخبرني انها مثلية الجنس وانها تكن لي المشاعر ', sid: 109}},
	        {inherit: 'stimulus_trial', data: {text: 'بعد ان تحدثت بالعربيه بالقطار  رجل بجانبي يغير مكانه  ', sid: 118}},
	        {inherit: 'stimulus_trial', data: {text: 'انااشهد  تلقي عجوز اجابة عدم الاصابه بفيروس الكورونا     ', sid: 48}},
	        {inherit: 'stimulus_trial', data: {text: 'ألموظفون اليهود معي في العمل يتقاضون اجرا اكثر مني    ', sid: 119}},
	        {inherit: 'stimulus_trial', data: {text: 'لا يشركونني يبرنامج للمواهب بادعائهم ان العرب غير موهوبين ', sid: 120}},
	        {inherit: 'stimulus_trial', data: {text: '      اتبرع بالمال  لدار الايتام لكن المسؤلين عن الميتم يسرقونه   ', sid: 130}},
	        {inherit: 'stimulus_trial', data: {text: '  خسرت جميع نقودي في مشروع كنت قد استثمرت فيه  ', sid: 131}},
	        {inherit: 'stimulus_trial', data: {text: '   اليوم الموعد الأخير لدفع قشط التعليم و ليس بحوزتي المال  ', sid: 132}},
	        {inherit: 'stimulus_trial', data: {text: 'أقوم بالقفز ثلاث مرات على قدمي اليمين رافعا يدي ', sid: 159}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ارفع حاسوبي النقال واضعه  في داخل محفظة الظهر    ', sid: 160}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اربط الحذاء الرياضي لاختي واقوم بالباسها حقيبة الظهر   ', sid: 161}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ابعث المكتوب بالبريد بعد ان وضعته بالمغلف البني  ', sid: 162}},
	        {inherit: 'stimulus_trial', data: {text: 'انا افكك برج المكعبات و أقوم باعادة ترتيبهم داخل الصندوق   ', sid: 163}},
		{inherit: 'stimulus_trial', data: {text: 'انا أرى من النافذه وصول الباص للمحطه ونزول الركاب ', sid: 164}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اصعد الى السياره وابدا بتعديل المراه الاماميه والخلفيه ', sid: 165}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اجمع القناني واضعهم  داخل الصندوق لكي أقوم ببيعهم  ', sid: 166}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اسمع صوت عبور السيارات على الشارع من النافذه   ', sid:167}},
	        {inherit: 'stimulus_trial', data: {text: 'انا احرك يدي اليمين ورجلي الشمال نحو الاعلى والاسفل     ', sid: 168}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اصعد ثلاث درجات لكي اصل الى باب شقتي    ', sid: 169}},
	        {inherit: 'stimulus_trial', data: {text: 'اضع حاسوبي النقال في الشاحن قبل ان ينفذ شحنه   ', sid: 170}},
	        {inherit: 'stimulus_trial', data: {text: 'انا امشي لمدة ربع ساعه وبعدها اتوقف للاستراحه جانبا     ', sid: 171}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اطوي ثماني وراقات خضراء على  شكل معين ومثلثات ', sid: 172}},
	        {inherit: 'stimulus_trial', data: {text: ' انا أضع محفظة نقودي  داخل جيب سترتي واقوم باغلاقها       ', sid: 173}},
	        {inherit: 'stimulus_trial', data: {text: 'انا ارجع الكتاب المستعار من المكتبه قبل خروجي منها    ', sid: 174}},
	        {inherit: 'stimulus_trial', data: {text: 'انا أرى اللافته على الطريق مكتوب عليها بئر السبع   ', sid: 175}},
	        {inherit: 'stimulus_trial', data: {text: 'أرى ثلاثة علب كرتونيه مرتبه من الأصغر الى الأكبر   ', sid: 176}},
	        {inherit: 'stimulus_trial', data: {text: ' انا استيقظ صباحا واجد نفسي في داخل حاوية نقايات  ', sid: 221}},
	        {inherit: 'stimulus_trial', data: {text: ' انا امشي بالمدينه ليلا ولا استطيع ابجاد طريق الرجوع    ', sid: 222}},
		{inherit: 'stimulus_trial', data: {text: 'انا أحاول الهروب راكضا لكني لا استطيع تحريك قدماي      ', sid: 223}},
	        {inherit: 'stimulus_trial', data: {text: ' الأرض تهتز من حولي وسقف الغرفه يبدا بالانهيار علي   ', sid: 224}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اغرق داخل بيضه وسائلها يدخل لداخل فمي وعيناي     ', sid: 225}},
	        {inherit: 'stimulus_trial', data: {text: 'انا في امتحان ولا أتذكر كلمه مما قد درست    ', sid: 226}},
	        {inherit: 'stimulus_trial', data: {text: 'انا اقف على المنصه للتمثيل لكن لا أتذكر النص ', sid: 227}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اقف امام الصف واكتشف انني ارتدي كنزه فقط       ', sid: 228}},
	        {inherit: 'stimulus_trial', data: {text: ' انا اتنقل بواسطة كرسي متحرك بسبب شلل في قدماي  ', sid: 229}},
	        {inherit: 'stimulus_trial', data: {text: 'أجد أن شخصًا  أودع  ثلاثون الف شيكل لحسابي   ', sid: 255}},
	        {inherit: 'stimulus_trial', data: {text: 'انا الطف شعر طفل مريض جدا وإذ به يشفى  ', sid: 256}},
	        {inherit: 'stimulus_trial', data: {text: '  اضع  يدي  بجيبي وأجد مئتا شيكلا لست انا من وضعهم   ', sid: 257}},
	        {inherit: 'stimulus_trial', data: {text: ' انا أقفز إلى أعلى وبقفزة واحدة  اصل لسطح المبنى    ', sid: 258}},
		{inherit: 'stimulus_trial', data: {text: 'انحفر المقال بذاكرتي فقط من خلال القاءي نظره عليه ', sid: 259}},
	        {inherit: 'stimulus_trial', data: {text: '  محاضري يتواصل معي بطلب ان  اكون مساعدته في بحث', sid: 260}},
	        {inherit: 'stimulus_trial', data: {text: ' انا أرقص في قاعة كبيرة مع أمير يراقبني بإعجاب     ', sid: 261}},
	        {inherit: 'stimulus_trial', data: {text: ' أنا سباحه شهيرة عالميا افوز بالمركز الأول في الأولمبيادة      ', sid: 262}}
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
