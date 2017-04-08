
function generateWinningNumber(){

  var randomNum = Math.ceil(Math.random() * 100.000001);
  if(randomNum === 0){ return 1; }
  return randomNum;
}


function shuffle(arr){
  var m = arr.length, t, i;

// While there remain elements to shuffle…
  while (m) {

  // set i as the round random number power arr.length-1(m)
  i = Math.floor(Math.random() * m--);
  // And swap it with the current element.
  t = arr[m];
  arr[m] = arr[i];
  arr[i] = t;

  }
  return arr;

}


function Game(){

  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();

}



Game.prototype.checkGuess = function(){
  if(this.playersGuess === this.winningNumber){

    $('#hint, #submit').prop("disabled",true);
    $('.player-input').prop('disabled', true);
    return 'You Win!';

  }else if(this.pastGuesses.includes(this.playersGuess)){
          return 'You have already guessed that number.';
        }else{
            // add the guess to pastGuess
             this.pastGuesses.push(this.playersGuess);
             // add it to the next child with the index
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            //enable hint only after 3 guesses
             if(this.pastGuesses.length === 3){
               $('#hint').fadeIn();
               $('#hint').prop('disabled', false);
             }
             if(this.pastGuesses.length === 5){
               $('#submit').prop('disabled', true);
               $('#hint').prop('disabled', true);
               $('.player-input').prop('disabled', true);
              return 'You Lose. The winning number is '+ this.winningNumber + '\nTry again!';

            }else  {            
                if(this.isLower()) {
                    $('h2').text("Guess Higher!")
                } else {
                    $('h2').text("Guess Lower!")
             }     
            // diff variable so we will not call this.difference() 3 times
            var diff = this.difference();
            if(diff < 10) {return 'You\'re burning up!';
            }else if(diff < 25){ return 'You\'re lukewarm.';
            }else if(diff < 50){ return 'You\'re a bit chilly.';
            } else { return 'You\'re ice cold!' }
            }
        }

}


function newGame(){
  return new Game();
}


Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
};



Game.prototype.isLower = function(){
  return this.playersGuess < this.winningNumber
};


Game.prototype.playersGuessSubmission = function(num){
  if(typeof num !== 'number' || num > 100 || num < 1){
    throw "That is an invalid guess.";
  }
  this.playersGuess = num;
//  this.checkGuess(num);
  return this.checkGuess();

};


Game.prototype.provideHint = function(){

  var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];

  return shuffle(hintArray);
};






//jQuery

$(document).ready(function(){
  $('#hint').hide();

  var game = new Game();

  $('#hint').prop('disabled', true);
  //every time the user click on the 'Go!' button
  $('#submit').click(function(event){
    //   call the function makeAGuess and pass the 'game' instance
    makeAGuess(game);
  });

  //  When the user click on enter or space
   $('.player-input').keypress(function(event) {
        // '13' the ascii number of the 'Carriage Return'
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    //new game button
    $('#newgame').click(function(event){
      game = newGame();
      // console.log(game.winningNumber);
      $('h1').text('Guessing Game!');
      $('h2').text('Guess a Number Between 1 - 100');
      $('.guess').text('-');
      $('#submit').prop("disabled",false);
      $('.player-input').prop('disabled', false);
      $('#hint').fadeOut('300');
      // focus on player input every new game
      $('.player-input').focus();
    });


    $('#hint').click(function() {
      var hints = game.provideHint();
      $('h1').text('One of the is your winning number '+hints[0]+', '+hints[1]+', or '+hints[2]);
      // Once the user use the hint. 
      $('#hint').fadeOut('300');
      // set hint disable for the current game
      $('#hint').prop('disabled', true);

    });
    

});


function makeAGuess(game){
  
  // Set the user input into a guess variable
  var guess = $('.player-input').val();
  // clear the text field
  $('.player-input').val("");
  if(guess !== ""){
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('h1').text(output);

  }
  
  
}

