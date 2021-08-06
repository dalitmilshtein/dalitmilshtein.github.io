
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
			    <p> לאחר שתיקראו את המשפט ותדמיינו את המצב המתואר בו תחלצו על מקש רווח   </p></br>
                            <p>  ואז תתבקשו לענות על 6 שאלות </p></br>                          
                            <p> אתם בוחרים את התשובה המתאימה לכם באמצעות לחיצה על המספר המתאים במקלדת  </p></br>
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
        Q1          : [{inherit:'defaultStim', media: 'סמן מה עוצמת הרגש שהתעורר בך כשקראת ודימיינת את המשפט               מ-1 שום רגש כלל עד 9 רגש עז מאוד'}],    
	Q2         : [{inherit:'defaultStim', media: 'סמן מה הסיכוי שתמצא את עצמך במצב המתואר במשפט מ-1 אין סיכוי כלל עד 9 סיכוי רב מאוד'}],
        Q3         : [{inherit:'defaultStim', media: 'סמן עד כמה המצב שאתה מדמיין חי ומפורט מ-1 כלל לא חי ומפורט עד 9 חי ומפורט מאוד  '}],
        Q4          : [{inherit:'defaultStim', media: 'סמן כמה מאמץ השקעת על מנת להפסיק לחשוב על המצב המתואר במשפט מ-1 ללא מאמץ כלל עד 9 מאמץ רב'}],    
	Q5         : [{inherit:'defaultStim', media: 'סמן כמה המצב המתואר במשפט קשור לפחדים שלך מ-1 קשור מאוד עד 9 לא קשור כלל'}], 
        Q6         : [{inherit:'defaultStim', media: 'סמן עד כמה המצב המתואר במשפט רלוונטי לחיים של סטודנטים יהודים וערבים בישראל מ-1 רלוונטי לסטונטים ערבים בלבד עד 9 רוונטי לסטודנטים יהודים בלבד '}]  
	    
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
        		    {type:'showStim', handle: 'Q6'},
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
            { media: '<%= trialData.text %>', css:{fontSize: '30px'}, handle:'target', data:{sid:'<%= trialData.sid %>'}}


        ]
    }]);

    /***********************************************
    // Script
     ***********************************************/

    
    
    API.addTrialSet('scripts', [
        {inherit: 'stimulus_trial', data: {text: 'אני ערבי במחסום וחייל ישראלי צועק מאיים עלי ברובה', sid: 1}},
        {inherit: 'stimulus_trial', data: {text: 'אני ערבי שבורח מחבורת בחורים יהודים שרודפים אחרי ברחוב ', sid: 2}},
        {inherit: 'stimulus_trial', data: {text: 'אני יושב באוטובוס ורואה שמכניסים מכות לנהג האוטובוס ערבי', sid: 3}},
        {inherit: 'stimulus_trial', data: {text: 'אני ערבי שיהודים  מכניסים לו מכות ומסביב מוחאים כפיים ', sid: 4}},
        {inherit: 'stimulus_trial', data: {text: 'אני ערבי שמגלה על דלת הדירה כתובת: מוות לערבים', sid: 5}},
        {inherit: 'stimulus_trial', data: {text: '"המתרגל בקורס מבקש להשקיע בתרגיל ולא לעשות "עבודה ערבית', sid: 6}},
        {inherit: 'stimulus_trial', data: {text: 'אנשים קולטים שאני ערבי ולא רוצים  לשבת לידי באוטובוס ', sid: 7}},
        {inherit: 'stimulus_trial', data: {text: 'אני שומע מישהו צוחק ואומר עלי שאני ערבי מסריח   ', sid: 8}},
	{inherit: 'stimulus_trial', data: {text: 'בכניסה לשדה התעופה מבקשים שאצא  מהאוטו כי אני ערבי  ', sid:9}},
        {inherit: 'stimulus_trial', data: {text: 'רופא בקופת חולים אומר לי שלערבים יש יותר מחלות ', sid: 10}},
        {inherit: 'stimulus_trial', data: {text: 'נהג מונית לא מסכים לקחת אותי כי אני ערבי  ', sid: 11}},
        {inherit: 'stimulus_trial', data: {text: 'בעל הבית מגלה שאני ערבי ומבקש שאעזוב את הדירה ', sid: 12}},
        {inherit: 'stimulus_trial', data: {text: 'חוסמים  אותי בכניסה למועדון עם החברים כי אני ערבי ', sid: 13}},
        {inherit: 'stimulus_trial', data: {text: 'שוטר עוצר אותי בלילה ברחוב  ודורש לראות תעודת זהות', sid: 14}},
        {inherit: 'stimulus_trial', data: {text: 'בקונסוליה אמריקאית לא רוצים לתת לי ויזה כי אני ערבי', sid: 15}},
        {inherit: 'stimulus_trial', data: {text: 'בבית קפה אנשים שומעים שאני מדבר ערבית ועוברים שולחן', sid: 16}},
        {inherit: 'stimulus_trial', data: {text: 'אני מספר בראיון עבודה שאני ערבי ומסלקים אותי החוצה', sid: 17}},
        {inherit: 'stimulus_trial', data: {text: 'אני ערבי שמגלה שיהודים שעובדים איתי  מרוויחים כפול ממני', sid: 18}},
        {inherit: 'stimulus_trial', data: {text: ' אני ערבי שמספר להורי שהחברה שלי יהודיה והם מזדעזעים', sid: 19}},
        {inherit: 'stimulus_trial', data: {text: 'ההורים התחזקו בדת האסלאם  ודורשים שאלך כול שבוע למסגד', sid: 20}},
        {inherit: 'stimulus_trial', data: {text: ' אני שומע בלילה יריות וצעקות מבית הדוד בגלל נקמת-דם ', sid: 21}},
        {inherit: 'stimulus_trial', data: {text: 'ההורים מפחדים מדיבורים ולא נותנים לי לבטל את הארוסין', sid: 22}},
        {inherit: 'stimulus_trial', data: {text: ' מכריחים אותי להתחתן עם בחורה שראו אותי מנשק אותה', sid: 23}},
        {inherit: 'stimulus_trial', data: {text: ' אבא שומע את אחותי מדברת על הדימום שלה במחזור', sid: 24}},
	{inherit: 'stimulus_trial', data: {text: ' הורים שלי מגרשים אותי מהבית כי שמעו שעשיתי סקס ', sid: 25}},
        {inherit: 'stimulus_trial', data: {text: 'הורים שלי אוסרים עלי ללבוש מכנסים קצרים מחוץ לבית ', sid: 26}},
        {inherit: 'stimulus_trial', data: {text: ' הורים שלי אוסרים עלי להתחיל ללמוד לפני שאני בונה בית  ', sid: 27}},
        {inherit: 'stimulus_trial', data: {text: 'הורים שלי אוסרים עלי ללכת לחתונה שגברים ונשים יחד ', sid: 28}},
        {inherit: 'stimulus_trial', data: {text: 'מנסים להכריח אותי להכיר את הבת דודה בשביל חתונה ', sid: 29}},
        {inherit: 'stimulus_trial', data: {text: 'אני מתעורר באמצע הלילה בגלל קול הירי שבחתונת השכנים ', sid: 30}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי בתחנת אוטובוס בלילה וקבוצת ערבים מקיפה אותי', sid: 31}},
        {inherit: 'stimulus_trial', data: {text: 'אני  יהודי שנכנס  לכפר ערבי ומתחילים לדפוק על האוטו', sid: 32}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי שמתעורר בלילה ורואה פורץ ערבי מתקרב אלי', sid: 33}},
        {inherit: 'stimulus_trial', data: {text: 'אני נקלע לקרב יריות של עבריינים ערבים ומנסה להתחבא ', sid: 34}},
        {inherit: 'stimulus_trial', data: {text: 'אני מסתכל על קבוצת נערים ערביים אונסים נערה צעירה', sid: 35}},
        {inherit: 'stimulus_trial', data: {text: 'מכונית עם נהג ערבי נוסעת בפראות  ומתנגשת ברכב שלי', sid: 36}},
        {inherit: 'stimulus_trial', data: {text: 'ערבים נכנסו לגור בדירה מולנו וכול הזמן יש צעקות', sid: 37}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי שמגלה שבחורה שאני יוצא איתה  ערבייה', sid: 38}},
        {inherit: 'stimulus_trial', data: {text: 'אני  יהודי שמספר להורי שהחברה שלי ערבייה והם מזדעזעים', sid: 39}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי שנכנס לכיתה ויש רק סטודנטים  שמדברים ערבית', sid: 40}},
	{inherit: 'stimulus_trial', data: {text: 'אני יהודי שיושב במונית ופתאום הנהג מדבר בטלפון בערבית', sid: 41}},
	{inherit: 'stimulus_trial', data: {text: 'אני יהודי שהולך ברחוב וערבי עם סכין רץ לכיווני', sid: 42}},   
	{inherit: 'stimulus_trial', data: {text: 'מודיעים לי בטלפון שהחבר הכי טוב שלי נהרג בפיגוע', sid: 43}},   
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי וערבי  גדול מתנפל עלי וצועק: אללה אכבר', sid: 44}},
        {inherit: 'stimulus_trial', data: {text: 'אני עומד מול הבית ההרוס של הוריי מטיל מעזה', sid: 45}},
        {inherit: 'stimulus_trial', data: {text: ' אני חייל שעומד במחסום ויורה על ערבי שרץ לכיווני ', sid:46}},
        {inherit: 'stimulus_trial', data: {text: 'אני חייל בסדיר וערבים זורקים עלינו אבנים ומקללים אותנו ', sid: 47}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי שמגלה שחבר ערבי  תומך בטרור נגד יהודים', sid: 48}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי שרואה בטלוויזיה חמאסניק מדבר על חיסול  ישראל', sid: 49}},
        {inherit: 'stimulus_trial', data: {text: 'סבא שלי מספר לי שאחיו  נרצח בשואה בתא גזים', sid: 50}},
        {inherit: 'stimulus_trial', data: {text: 'אני יהודי במחנה ריכוז בשואה ומכריחים אותי להתפשט ערום', sid: 51}},
        {inherit: 'stimulus_trial', data: {text: ' אני יהודי ברחוב בחו"ל ורואה כתובת גרפיטי: מוות ליהודים', sid: 52}},
        {inherit: 'stimulus_trial', data: {text: 'אני ישראלי-יהודי בקפה בחו"ל וכתוב אין כניסה לישראלים', sid: 53}},
        {inherit: 'stimulus_trial', data: {text: 'אני רואה בפייסבוק תמונת  יהודי עם  פנים של חולדה', sid: 54}},
        {inherit: 'stimulus_trial', data: {text: 'בקונסוליה אמריקאית לא נותנים לי ויזה כי אני מתנחל', sid: 55}},
        {inherit: 'stimulus_trial', data: {text: 'אני מגלה שהעלו תמונות שלי בפייסבוק עם הכיתוב יהודי גנב', sid: 56}},
	{inherit: 'stimulus_trial', data: {text: 'אני יהודי  שומר מסורת ותוקעים לי בפה בשר וגבינה', sid: 57}},    
        {inherit: 'stimulus_trial', data: {text: ' סטודנטים  מארה"ב אומרים לי שחשבו שיהודים שותים דם ילדים', sid: 58}},
	{inherit: 'stimulus_trial', data: {text: 'אני רואה יהודי חרדי חוטף מכות בגרמניה מניאו נאצים', sid: 59}},
        {inherit: 'stimulus_trial', data: {text: 'ביציאה ממלון בחו"ל מאשימים אותי שאני  גנב יהודי מישראל', sid: 60}},
        {inherit: 'stimulus_trial', data: {text: 'אני מקבל הודעה במייל שלימודי מופסקים בגלל ציונים גרועים ', sid: 61}},
        {inherit: 'stimulus_trial', data: {text: 'מרצה במכללה מנסה לתקוף אותי מינית אחרי שסרבתי לו', sid: 62}},
        {inherit: 'stimulus_trial', data: {text: ' אני נרדם ברכבת והתיק שלי עם המחשב שלי נגנב', sid: 63}},
        {inherit: 'stimulus_trial', data: {text: ' מרצה אומר לי שהמטלה שהשקעתי בה המון, ממש גרועה', sid: 64}},
        {inherit: 'stimulus_trial', data: {text: 'מישהו דוחף אותי חזק והמחשב הנייד שלי נופל ונשבר ', sid: 65}},
        {inherit: 'stimulus_trial', data: {text: ' אני צוחק על המרצה שלי והוא עומד מאחורי ושומע  ', sid: 66}},
        {inherit: 'stimulus_trial', data: {text: 'אני מקבל מייל עם ציון נכשל בבחינה ועף מהמחלקה ', sid: 67}},
        {inherit: 'stimulus_trial', data: {text: 'אני בועט בארגז ומגלה גור  של חתול שמת מהבעיטה ', sid: 68}},
        {inherit: 'stimulus_trial', data: {text: 'אמא מגלה לי שיש לה סרטן שהתפשט בכל הגוף ', sid: 69}},
	{inherit: 'stimulus_trial', data: {text: 'אני מחכה עם אבא בבית חולים כדי שיקבל כימותרפיה', sid: 70}},
        {inherit: 'stimulus_trial', data: {text: 'אני מסתכלת בטלפון בנהיגה ומאבדת שליטה ואמא נפצעת קשה', sid: 71}},
        {inherit: 'stimulus_trial', data: {text: 'אני נותן ביס בכריך ומגלה שיש לי מקק בפה', sid: 72}},
        {inherit: 'stimulus_trial', data: {text: 'אני מאבד שליטה מכניס מכות רצח לילד קטן מאוד', sid: 73}},
        {inherit: 'stimulus_trial', data: {text: 'אני יושב על כסא גלגלים משותק לגמרי מהמותניים ומטה', sid: 74}},
        {inherit: 'stimulus_trial', data: {text: 'אני נכנס למיטה ומגלה על הסדין כתמי חרא מרוחים ', sid: 75}},
        {inherit: 'stimulus_trial', data: {text: 'אני יושב לבד ביום ההולדת שלי ומחכה שמישהו יתקשר', sid: 76}},
        {inherit: 'stimulus_trial', data: {text: ' מהחלון שלי אני רואה ילדים שמנסים לשרוף חתול בקופסה', sid: 77}},
        {inherit: 'stimulus_trial', data: {text: 'אני בבית החולים וכולם מתרחקים ממני כי נדבקתי בקורונה', sid: 78}},
        {inherit: 'stimulus_trial', data: {text: 'כורתים לי את האשכים אחרי שמצאו אצלי גושיים סרטניים', sid: 79}},
        {inherit: 'stimulus_trial', data: {text: 'לאמא שלי יש אלצהיימר ולפעמים אני מזכיר לה איך לאכול', sid: 80}},
        {inherit: 'stimulus_trial', data: {text: ' אני עומד מאחורי הדלת ושומע  החברים שלי לועגים לי', sid: 81}},
	{inherit: 'stimulus_trial', data: {text: ' אני מגלה  שבחורה שאני מאוהב בה וחבר שלי מתחתנים', sid: 82}},
        {inherit: 'stimulus_trial', data: {text: 'אני מבקר את אבא שלי שהזקין ולא מזהה אותי ', sid: 83}},
        {inherit: 'stimulus_trial', data: {text: 'אני שומע במקרה את חברי מתכננים נסיעה  ומסתירים ממני ', sid: 84}},
        {inherit: 'stimulus_trial', data: {text: 'במהלך ראיון עבודה מזלזלים בי כי אני נראה דתי ', sid: 85}},
        {inherit: 'stimulus_trial', data: {text: 'החברה שלי נפרדה ממני כי רציתי יחסי-מין  לפני הנישואין', sid: 86}},
        {inherit: 'stimulus_trial', data: {text: 'אני מגלה לבחורה שאני מחבב אותה והיא נגעלת ממני ', sid: 87}},
        {inherit: 'stimulus_trial', data: {text: 'אני הולך ברחוב בגשם ורואה קשיש רועד על ספסל', sid: 88}},
        {inherit: 'stimulus_trial', data: {text: 'מישהו אוכל לידי ויורק בטעות גוש ליחה לצלחת שלי', sid: 89}},
        {inherit: 'stimulus_trial', data: {text: 'אני יושבת בבחינה ולא מצליחה להיזכר מילה ממה שלמדתי', sid: 90}},
        {inherit: 'stimulus_trial', data: {text: 'אני בונה מגדל משלושים ושתיים קוביות אדומות ירוקות וכחולות ', sid: 91}},
        {inherit: 'stimulus_trial', data: {text: 'אני מחלק לכל אחד מהשחקנים כמה קלפים בצבעים שונים', sid: 92}},
        {inherit: 'stimulus_trial', data: {text: 'אני מניף את יד ימין ורגל שמאל למעלה ולמטה ', sid: 93}},
        {inherit: 'stimulus_trial', data: {text: 'אני פותח את הארון להוציא צלחות מרק עמוקות ובקבוק ', sid: 94}},
        {inherit: 'stimulus_trial', data: {text: 'אני נועלת זוג נעלי התעמלות לבנות ומכפתרת חמישה כפתורים ', sid: 95}},
        {inherit: 'stimulus_trial', data: {text: 'אני מקפל שמונה דפי פוליו מקלסר לשני קיפולים אלכסוניים', sid: 96}},
        {inherit: 'stimulus_trial', data: {text: 'אני פוסע חמישה צעדים קדימה לפני שאני פונה שמאלה', sid: 97}},
	{inherit: 'stimulus_trial', data: {text: 'אני עוטף בנייר שקוף וסרט מפוספס כתום', sid: 98}},
        {inherit: 'stimulus_trial', data: {text: 'אני שם את המעטפה בתוך המגרה מתחת לכל הדפים ', sid: 99}},
        {inherit: 'stimulus_trial', data: {text: ' אני מחזיר את הספר לסיפרייה לפני שאצא לכיוון הרחוב', sid: 100}},
        {inherit: 'stimulus_trial', data: {text: 'אני משנה את הסדר של הדפים בחבילה העטופה בעיתון', sid: 101}},
        {inherit: 'stimulus_trial', data: {text: 'אני מכניס לארגז את בקבוקי הפלסטיק לצד בקבוקי הזכוכית', sid: 102}},
        {inherit: 'stimulus_trial', data: {text: 'אני מצייר על הדף חמישה משולשים ליד שלושה ריבועים', sid: 103}},
        {inherit: 'stimulus_trial', data: {text: 'אני שומר את הקלסר במדף הכי גבוה בארון הספרים', sid: 104}},
        {inherit: 'stimulus_trial', data: {text: 'אני מחכה שלוש דקות עד שהמים יגיעו לרתיחה בקומקום', sid: 105}},
        {inherit: 'stimulus_trial', data: {text: 'אני בודק אם בתוך המחברת נשארו לי דפים ריקים', sid: 106}},
        {inherit: 'stimulus_trial', data: {text: 'אני מכין שלוש ערמות שונות של בגדים בצבעים שונים', sid: 107}},
        {inherit: 'stimulus_trial', data: {text: 'אני מרים את התיק מהרצפה ומניחה על שולחן הכתיבה', sid: 108}},
        {inherit: 'stimulus_trial', data: {text: 'אני שואל את המזכירה מתי היא סוגרת את המשרד', sid: 109}},
        {inherit: 'stimulus_trial', data: {text: 'אני אוסף את כל הבקבוקים ושמה אותם בארגז קרטון', sid: 110}},
        {inherit: 'stimulus_trial', data: {text: 'אני מפרק את חבילת הדפים כדי לסדר אותם בתיקיות', sid: 111}},
        {inherit: 'stimulus_trial', data: {text: 'אני שולח את המכתב בדואר אחרי שהדבקתי בול במעטפה', sid: 112}},
        {inherit: 'stimulus_trial', data: {text: 'אני פותח ובודק את תיבת הדואר שלי במחשב האישי ', sid: 113}},
	{inherit: 'stimulus_trial', data: {text: 'אני מפעיל את המכשיר אחרי שאני קורא את ההוראות ', sid: 114}},
	{inherit: 'stimulus_trial', data: {text: 'אני מפנה את שולחן האוכל ואז מפעיל מדיח כלים ', sid: 115}},   
	{inherit: 'stimulus_trial', data: {text: 'אני סוגר את הספר ומסמן עם סימניה לאן הגעתי', sid: 116}},   
        {inherit: 'stimulus_trial', data: {text: 'אני מחבר את המחשב הנייד שלי לחשמל כדי שיטען', sid: 117}},
        {inherit: 'stimulus_trial', data: {text: 'אני כותב במחברת שלושה וחצי משפטים עם עט מהקלמר', sid: 118}},
        {inherit: 'stimulus_trial', data: {text: 'אני מנתק את הטלפון מהמטען ומחזיר אותו בחזרה לכיס', sid: 119}},
        {inherit: 'stimulus_trial', data: {text: 'אני מנקב חורים בדף לפני שמוסיף אותו לקלסר הלימודים', sid: 120}},
       
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
