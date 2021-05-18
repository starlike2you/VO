var colors = ["blue", "orange", "yellow", "purple"];
    //var koreanColors = ["blue", "orange", "yellow", "purple"];
    var koreanColors = ["파란색", "주황색", "노란색", "보라색"];
    var counter = 0;
    var skipCounter = 0;
    var score = 0;
    var playerName = "";
    var highScore = 0;
    var seconds = 0;
    const audioBeep = new Audio("audios/beep.mp3");
    const audioApplause = new Audio("audios/applause.mp3");
    const audioAwww = new Audio("audios/awww.mp3");

    function countDown() {
        var timer2 = "00:50";
        var interval = setInterval(function () {
            var timer = timer2.split(':');
            //by parsing integer, I avoid all extra string processing
            var minutes = parseInt(timer[0], 10);
            seconds = parseInt(timer[1], 10);
            --seconds;
            minutes = (seconds < 0) ? --minutes : minutes;
            if (minutes < 0) clearInterval(interval);
            seconds = (seconds < 0) ? 59 : seconds;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            //minutes = (minutes < 10) ?  minutes : minutes;
            if (seconds > 0) {
                $('#countdown').html(minutes + ':' + seconds);
            }
            else {
                audioApplause.pause();
                audioAwww.pause();
                audioBeep.play();
                clearInterval(interval)
                $('#countdown').html("시간 최대");
                finishGame();
            }
            timer2 = minutes + ':' + seconds;
        }, 1000);
    }

    function setColorsSkip() {
        if(colors.length === counter){
            counter = 0;
        }
        console.log("counter is " + counter);
        $('#showColor').css('background-color', colors[counter]);
        counter++;
        skipCounter++;
    }

    function setColors() {
        if(colors.length === counter){
            counter = 0;
        }
        $('#showColor').css('background-color', colors[counter]);
        counter++;
    }

    function record() {
        $('#response').html("");
        if ('webkitSpeechRecognition' in window) {
            var recognition = new webkitSpeechRecognition();
            recognition.lang = "ko-KR";
            //recognition.lang = "en-US";
            recognition.onresult = function (event) {
                var transcript = event.results[0][0].transcript;
                console.log("You said: " + transcript);
                console.log("Result: " + transcript.localeCompare(koreanColors[counter - 1]));
                console.log("Color: " + colors[counter - 1]);
                console.log("Korean Color: " + koreanColors[counter - 1]);
                if (seconds > 0) {
                    if (transcript.localeCompare(koreanColors[counter - 1]) === 0) {
                        audioAwww.pause();
                        audioApplause.play();
                        $('#response').html("잘 했어 :-)");
                        score = score + 10;
                        $('#score').html(score);
                        setColors();

                    } else {
                        audioApplause.pause();
                        audioAwww.play();
                        $('#response').html("죄송합니다 :-(");
                    }
                }else{
                    recognition.stop();
                }
            }
            recognition.start();
        } else {
            $('#response').html("이 브라우저에서 지원되지 않는 음성 인식");
        }

    }

    function finishGame() {
        $('#response').html("당신의 점수는 " + score);
        $('#playAgainBtn').css("visibility", "visible");
        $("#speakBtn").addClass('disabled');
        $("#skipBtn").addClass('disabled');
        saveScore();
    }

    function playAgain() {
        $("#speakBtn").removeClass('disabled');
        $("#skipBtn").removeClass('disabled');
        $('#playAgainBtn').css("visibility", "hidden");
        $('#response').html("");
        $('#score').html("00");
        counter = 0;
        skipCounter = 0;
        score = 0;
        countDown();
        setColors();
        setScoresAndInfo();
    }

    function saveScore() {
        window.localStorage.setItem(playerName, score);
        console.log("Current Score " + score + " and high score " + highScore);

        if (highScore == 'null') {
            window.localStorage.setItem("highScore", score);
        } else if (score > Number(highScore)) {
            window.localStorage.setItem("highScore", score);
        }

    }

    function setScoresAndInfo() {
        var playerInfo = window.localStorage.getItem(playerName);
        highScore = window.localStorage.getItem("highScore");
        if (playerInfo != null) {
            $("#prevScore").html(playerInfo);
        } else {
            $("#prevScore").html("N/A");
        }

        if (highScore != 'null') {
            $("#highScore").html(highScore);
        } else {
            $("#highScore").html("N/A");
        }
    }