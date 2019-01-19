/*******************************
 ****** Quiz Controller*********
 *******************************/

var quizController = (
    function(){
       //*********Question Constructor */
       function Question(id, questionText, options, correctAnswer){
            this.id = id;
            this.questionText = questionText;
            this.options = options;
            this.correctAnswer = correctAnswer;
       }

       var questionLocalStorage = {
           setQuestionCollection : function(newCollection){
               localStorage.setItem('questionCollection', JSON.stringify(newCollection));
           },

           getQuestionCollection : function(){
             return JSON.parse(localStorage.getItem('questionCollection'));
           },

           removeQuestionCollection : function(){
               localStorage.removeItem('questionCollection');
           }
       };

       if(questionLocalStorage.getQuestionCollection() === null)
       {
           questionLocalStorage.setQuestionCollection([]);
       }

       var quizProgress = {
            questionIndex : 0
       };
       /**********************PERSON Constructor ***********************************/
       function Person(id, firstname, lastname, score){
            this.id = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.score = score;
       }

       var currPersonData = {
           fullname : [],
           score : 0
       }

       var adminFullName = ['John', 'Smith'];

       var personLocalStorage = {
           setPersonData : function(newPersonData){
               localStorage.setItem('personData', JSON.stringify(newPersonData) );
           },

           getPersonData : function(){
               return JSON.parse(localStorage.getItem('personData'));
           },

           removePersonData : function(){
                localStorage.removeItem('personData');
           }
       };

       if(personLocalStorage.getPersonData() === null){
           personLocalStorage.setPersonData([]);
       }


       return {

             getQuizProgress : quizProgress,

             getQuestionLocalStorage: questionLocalStorage,

             addQuestionOnLocalStorage: function(newQuestText, opts){
                var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
                if(questionLocalStorage.getQuestionCollection() === null)
                {
                    questionLocalStorage.setQuestionCollection([]);
                }
                
                optionsArr =   [];
                questionId = 0;
                isChecked = false;
                for(var i=0; i< opts.length; i++)
                {
                    if(opts[i].value !== "")
                    {
                        optionsArr.push(opts[i].value);
                    }

                    if(opts[i].previousElementSibling.checked && opts[i].value !== "")
                    {
                        corrAns  = opts[i].value;
                        isChecked = true;
                    }
                }
                console.log(optionsArr);
                if(questionLocalStorage.getQuestionCollection().length > 0)
                {
                    questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
                }
                else
                {
                    questionId = 0;
                }
                if(newQuestText.value !== "")
                {
                    if(optionsArr.length > 1)
                    {
                        if(isChecked)
                        {
                            newQuestion = new Question(questionId, newQuestText.value , optionsArr , corrAns);

                            getStoredQuests = questionLocalStorage.getQuestionCollection();

                            getStoredQuests.push(newQuestion);

                            questionLocalStorage.setQuestionCollection(getStoredQuests);

                           // console.log(optionsArr);
                            //console.log(corrAns);

                            newQuestText.value = "";
                            for(var x=0; x < opts.length; x++)
                            {
                                opts[x].value = "";
                                opts[x].previousElementSibling.checked = false;
                            }

                            console.log(questionLocalStorage.getQuestionCollection());
                            return true;
                        }
                        else
                        {
                            alert("You missed to check correct answer, or you checked answer without value");
                            return false;
                        }
                    }
                    else
                    {
                        alert("you must insert atleast 2 option");
                        return false;
                    }
               }
               else{
                   alert('Please , Insert Question');
                   return false;
               }
             },

             checkAnswer : function(ans){

                if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent){
                    currPersonData.score++;
                    return true;
                }
                else{
                    return false;
                }
             },

             isFinished : function(){
                return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
             },

             addPerson : function(){
                 var newPerson, personId, personData;
                 if(personLocalStorage.getPersonData().length > 0){
                     personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
                 }else
                 {
                     personId = 0;
                 }

                 newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);
                
                 personData = personLocalStorage.getPersonData();

                 personData.push(newPerson);

                 personLocalStorage.setPersonData(personData);
             },

             getCurrPersonData : currPersonData,

             getAdminFullName : adminFullName,

             getPersonLocalStorage : personLocalStorage
       };
        
    }
)();
/*******************************
 ****** UI Controller*********
 *******************************/

var UIController = (
    function(){
        /****Admin Panel Elements */
        var domItems={
            /************************Admin Panel Element *************/
            adminPanelSection : document.querySelector('.admin-panel-container'),
            questInsertBtn: document.getElementById('question-insert-btn'),
            newQuestionText: document.getElementById('new-question-text'),
            adminOptions: document.querySelectorAll('.admin-option'),
            adminOptionsContainer: document.querySelector('.admin-options-container'),
            insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
            questionUpdateBtn: document.getElementById('question-update-btn'),
            questionDeleteBtn: document.getElementById('question-delete-btn'),
            questsClearBtn : document.getElementById('questions-clear-btn'),
            resultListWrapper :document.querySelector(".results-list-wrapper"),
            clearResultBtn : document.getElementById("results-clear-btn"),
            /*****************Quiz Section Elements***********************/
            quizSection : document.querySelector(".quiz-container"),
            askedQuestText : document.getElementById("asked-question-text"),
            quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
            progressBar : document.querySelector("progress"),
            progressPar : document.getElementById("progress"),
            instAnsContainer : document.querySelector(".instant-answer-container"),
            instAnsText : document.getElementById("instant-answer-text"),
            instAnsDiv : document.getElementById("instant-answer-wrapper"),
            emotionIcon : document.getElementById("emotion"),
            nextQuestbtn : document.getElementById("next-question-btn"),
            /********************Landing Page Element ******************/
            landPageSection : document.querySelector(".landing-page-container"),
            startQuizBtn : document.getElementById("start-quiz-btn"),
            firstNameInput : document.getElementById("firstname"),
            lastNameInput : document.getElementById("lastname"),
            /*******************Final Result Section *****************/
            finalResSection : document.querySelector(".final-result-container"),
            finalScoreText : document.getElementById("final-score-text")

        };

        return {
            getDomItems : domItems,

            addInputsDynamically : function(){

                var addInput = function(){

                    
                   var inputHTML, z;

                 z = document.querySelectorAll('.admin-option').length;

                  inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ z +'" name="answer" value="'+ z +'"><input type="text" class="admin-option admin-option-'+ z +'" value=""></div>';
                                
                   domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                   domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                   domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

                }

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            },

            createQuestionList : function(getQuestions)
            {
                var questHTML, numberingArr;
                //  console.log(getQuestions);
                numberingArr = [];
                domItems.insertedQuestsWrapper.innerHTML = "";
                for(var i=0; i < getQuestions.getQuestionCollection().length; i++)
                {
                    numberingArr.push(i+1);

                    questHTML = '<p><span>' + numberingArr[i] +'.'+ getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id +'">Edit</button></p>';

                    domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin',questHTML);
                }

               
            },

            editQuestionList : function(event, storageQuestList, addInpsDynFn, updateQuestListFn){

                var getId, getStorageQuestList, foundItem, PlaceInArr, optionHTML;

                if('question-'.indexOf(event.target.id)){
                 
                    getId = parseInt(event.target.id.split('-')[1]);

                    getStorageQuestList = storageQuestList.getQuestionCollection();

                    for(var x=0; x < getStorageQuestList.length; x++)
                    {
                        if(getStorageQuestList[x].id === getId)
                        {
                            foundItem = getStorageQuestList[x];

                            PlaceInArr = x;
                        }
                    }
                    domItems.newQuestionText.value = foundItem.questionText;

                    domItems.adminOptionsContainer.innerHTML = "";

                    optionHTML = '';

                    for(var x=0; x < foundItem.options.length; x++)
                    {
                     optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+ x +'" name="answer" value="'+x+'"><input type="text" class="admin-option admin-option-'+x+'" value="'+ foundItem.options[x] +'"></div>';
                                         
                    }

                    domItems.adminOptionsContainer.innerHTML = optionHTML;

                    domItems.questionUpdateBtn.style.visibility = 'visible';
                    domItems.questionDeleteBtn.style.visibility = 'visible';
                    domItems.questInsertBtn.style.visibility = 'hidden';
                    domItems.questsClearBtn.style.pointerEvents = 'none';

                    
                    addInpsDynFn();

                    var backDefaultView = function(){

                        var updateOption;
                        domItems.newQuestionText.value = '';
                        updateOption = document.querySelectorAll('.admin-option');
                        for(var x=0; x< updateOption.length;x++){
                            updateOption[x].value = '';
                            updateOption[x].previousElementSibling.checked = false;
                        }

                        domItems.questionUpdateBtn.style.visibility = 'hidden';
                        domItems.questionDeleteBtn.style.visibility = 'hidden';
                        domItems.questInsertBtn.style.visibility = 'visible';
                        domItems.questsClearBtn.style.pointerEvents = '';
                        updateQuestListFn(storageQuestList);
                    }
                    
                    var updateQuestion = function(){
                        
                        var newOptions, optionEls;
                        newOptions = [];
                        optionEls = document.querySelectorAll('.admin-option');
                        foundItem.questionText = domItems.newQuestionText.value;                        
                        foundItem.correctAnswer = '';

                        for(var i=0;i < optionEls.length;i++)
                        {
                            if(optionEls[i].value !== '')
                            {
                                newOptions.push(optionEls[i].value);
                                if(optionEls[i].previousElementSibling.checked)
                                {
                                    foundItem.correctAnswer = optionEls[i].value;
                                }
                            }
                        }

                        foundItem.options = newOptions;
                        
                        if(foundItem.questionText !== ''){
                            if(foundItem.options.length > 1){
                                if(foundItem.correctAnswer !== ''){
                                    getStorageQuestList.splice(PlaceInArr, 1, foundItem);

                                    storageQuestList.setQuestionCollection(getStorageQuestList);

                                   backDefaultView();
                                }
                                else{
                                    alert("You missed to check correct answer, or you checked answer without value");
                                }
                            }else{
                                alert("you must insert atleast 2 option");
                            }
                        }
                        else
                        {
                            alert('Please , Insert Question');                            
                        }
                    }

                    domItems.questionUpdateBtn.onclick = updateQuestion;

                    var deleteQuestion = function(){
                        
                        getStorageQuestList.splice(PlaceInArr, 1);

                        storageQuestList.setQuestionCollection(getStorageQuestList);

                        backDefaultView();
                    }

                    domItems.questionDeleteBtn.onclick = deleteQuestion;
                }
            },

            clearQuestList : function(storageQuestList){

                    if(storageQuestList.getQuestionCollection() !== null){
                        if(storageQuestList.getQuestionCollection().length > 0){

                        var conf = confirm('Warning! you will loose all your data');
                        if(conf){
                            storageQuestList.removeQuestionCollection();
                            domItems.insertedQuestsWrapper.innerHTML = '';
                        }
                    }
                }
            },

            displayQuestion: function(storageQuestList, progress){

               // console.log("works");

               if(storageQuestList.getQuestionCollection().length > 0){
                    var newOptionHTML, characterArr;
                    characterArr =['A','B','C','D','E','F'];
                    domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;
                    domItems.quizOptionsWrapper.innerHTML = '';

                    for(var i=0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length ; i++){

                        newOptionHTML = '<div class="choice-'+i+'"><span class="choice-'+i+'">'+ characterArr[i] +'</span><p  class="choice-'
                        +i+'">'+ storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] +'</p></div>'

                        domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                    }


               }
            },

            displayProgress : function(storageQuestList, progress){
                
                domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
                domItems.progressBar.value = progress.questionIndex + 1;
                domItems.progressPar.textContent = (progress.questionIndex +1) + '/' + storageQuestList.getQuestionCollection().length;
                
            },

            newDesign : function(ansResult, selectedAnswer){

                var twoOptions, index;
                index = 0;
                if(ansResult){
                    index = 1;                    
                }

                twoOptions = {
                    instAnswerText : ['This is a wrong answer', 'This is a correct answer'],
                    instAnswerClass : ['red', 'green'],
                    emotionType : ['images/sad.png', 'images/happy.png'],
                    optionSpanBg : ['rgba(200, 0, 0, .7)','rgba(0, 250, 0, .2)']
                };
                domItems.quizOptionsWrapper.style.cssText = "opacity : 0.6; pointer-events : none;";
                domItems.instAnsContainer.style.opacity = "1";
                domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
                domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
                domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);   
                selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];            

            },

            resetDesign: function(){
                
                domItems.quizOptionsWrapper.style.cssText = "";
                domItems.instAnsContainer.style.opacity = "0";
            },

            getFullName : function(currPerson, storageQuestList, admin){
                if(domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== ""){
                    if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])){
                        if(storageQuestList.getQuestionCollection().length > 0){
                            currPerson.fullname.push(domItems.firstNameInput.value);
                            currPerson.fullname.push(domItems.lastNameInput.value);
                            domItems.landPageSection.style.display = "none";
                            domItems.quizSection.style.display = "block";
                        }
                        else{
                            alert("Quiz is not ready, please contact Admin!!");
                        }
                    }
                    else{
                        domItems.landPageSection.style.display = "none";
                        domItems.adminPanelSection.style.display = "block";
                    }
                }else
                {
                    alert("Please Enter Your FirstName and LastName");
                }    
            },

            finalResult : function(currPerson){
                 domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', Your Final Score is '
                      + currPerson.score;
                
                domItems.quizSection.style.display = "none";
                domItems.finalResSection.style.display = "block";

            },

            addResultOnPanel : function(userData){
                var resultHTML;
                domItems.resultListWrapper.innerHTML = "";
                for(var i=0; i < userData.getPersonData().length ; i++)
                {
                    resultHTML = '<p class="person person-'+ i +'"><span class="person-'+ i +'">'+ userData.getPersonData()[i].firstname +
                    ' ' + userData.getPersonData()[i].lastname + '- '+ userData.getPersonData()[i].score +' Points</span><button id="delete-result-btn_'+ userData.getPersonData()[i].id +'" class="delete-result-btn">Delete</button></p>';

                    domItems.resultListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
                }

                
            },

            deleteResult : function(e, userData){
                    var getId, personArr;
                    personArr = userData.getPersonData();
                if('delete-result-btn_'.indexOf(e.target.id)){
                    getId = parseInt(event.target.id.split('_')[1]);
                    for(var i=0; i< personArr.length; i++){
                        if(personArr[i].id === getId){
                            personArr.splice(i, 1);
                            userData.setPersonData(personArr);
                        }
                    }
                }

            },

            clearResultList : function(userData){

                var conf;
                if(userData.getPersonData() !== null){
                    if(userData.getPersonData().length > 0){
                            conf = confirm("Warning!! You will entire result list!");

                            if(conf){
                                userData.removePersonData();
                                domItems.resultListWrapper.innerHTML = '';
                            }
                        }
                    }
                }

            };
    }
)();

/*******************************
 ******Controller*********
 *******************************/

var controller = (
    function(quizCtrl, UICtrl){
       

        var selectedDomItems =  UICtrl.getDomItems;

        UICtrl.addInputsDynamically();

        UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

        selectedDomItems.questInsertBtn.addEventListener('click',function(){

           var adminOptions = document.querySelectorAll('.admin-option');
           var checkBoolean = quizController.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

           if(checkBoolean)
           {
             UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
           }

        });

        selectedDomItems.insertedQuestsWrapper.addEventListener('click', function(e)
        {
                UICtrl.editQuestionList(e , quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList );
        });

        selectedDomItems.questsClearBtn.addEventListener('click', function(){

                UICtrl.clearQuestList(quizController.getQuestionLocalStorage);
        });

        UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);

        UICtrl.displayProgress(quizController.getQuestionLocalStorage, quizController.getQuizProgress);

        selectedDomItems.quizOptionsWrapper.addEventListener('click', function(e){

            var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

            for(var i=0; i< updatedOptionsDiv.length; i++){
                if(e.target.className === 'choice-' + i){
                    var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);
                    var answerResult = quizCtrl.checkAnswer(answer);
                    UICtrl.newDesign(answerResult, answer);
                    if(quizCtrl.isFinished()){
                        selectedDomItems.nextQuestbtn.textContent = "Finish";
                    }
                    var nextQuestion =  function(questData, progress){
                        
                        if(quizCtrl.isFinished()){
                            quizCtrl.addPerson();                            
                            UICtrl.finalResult(quizCtrl.getCurrPersonData);
                        }else{
                            UICtrl.resetDesign();
                            quizCtrl.getQuizProgress.questionIndex++;
                            UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
                            UICtrl.displayProgress(quizController.getQuestionLocalStorage, quizController.getQuizProgress);
                        }

                    }
                    selectedDomItems.nextQuestbtn.onclick = function(){
                        nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                    }
                }
            }
        });

        selectedDomItems.startQuizBtn.addEventListener('click', function(){
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName );
        });

        selectedDomItems.lastNameInput.addEventListener('focus', function(){
            selectedDomItems.lastNameInput.addEventListener('keypress', function(e){
                    if(e.keyCode === 13){
                        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName );
                    }

            });
        });

        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

        selectedDomItems.resultListWrapper.addEventListener('click', function(e){
            
            UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
            UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
        });

        selectedDomItems.clearResultBtn.addEventListener('click' , function(){
            UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
        });
    }

)(quizController, UIController);