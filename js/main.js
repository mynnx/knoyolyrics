var lyricLines = [
    {lyric: "Now, this is the story all about how", missingWord: 4},
    {lyric: "My life got flipped-turned upside down", missingWord: 3},
    {lyric: "And I'd like to take a minute, just sit right there", missingWord: 6},
    {lyric: "I'll tell you how I became the prince of a town called Bel Air", missingWord: 7},
    {lyric: "In West Philadelphia, born and raised", missingWord: 2},
    {lyric: "On the playground is where I spent most of my days", missingWord: 2},
    {lyric: "Chillin' out, maxin', relaxin' all cool", missingWord: 0},
    {lyric: "And all shootin' some B-ball outside of the school", missingWord: 4},
];

var LyricList = React.createClass({
    render: function() {
        //var lyric = this.props.lyricLines[0];
        //return ( <LyricLine lyric={lyric.lyric} missingWord={lyric.missingWord} /> );
        var lyricNodes = this.props.lyricLines.map(function(lyricLine) {
            return (
                <LyricLine lyric={lyricLine.lyric}
                           missingWord={lyricLine.missingWord}
                           updateScore={this.updateScore}/>
            );
        });
        return ( <div> {lyricNodes} <ScoreCard score={0} /></div> );
    }
});

// STATES
var LyricLine = React.createClass({
    getInitialState: function() {
        return {
            currentValue: null
        }
    },

    onLoseFocus: function (value) {
        this.setState({
            currentValue: value
        })
        this.props.updateScore(this.isCorrect);
    },

    isCorrect: function() {
        var correctAnswer = this.props.lyric.split(" ")[this.props.missingWord];
        return (this.state.currentValue == correctAnswer);
    }

    render: function() {
        var words = this.props.lyric.split(" ");
        var wordsLeft = words.slice(0, this.props.missingWord);
        var wordsRight = words.slice(this.props.missingWord + 1);
        var wordToReplace = words[this.props.missingWord];
        var replaceWith = null;
        if (this.state.currentValue == null) {
            replaceWith = (<LyricPrompt word={wordToReplace} onLoseFocus={this.onLoseFocus}/>);
        } else {
            if (this.state.currentValue == wordToReplace) {
                replaceWith = <span className="answer-right">{this.state.currentValue}</span>;
            } else {
                replaceWith = [(<span className="answer-wrong">{this.state.currentValue}</span> ),
                               (<span className="answer-correction">{wordToReplace}</span>)];
            }
        }
        return (
            <p>
                {wordsLeft.join(" ")} {replaceWith} {wordsRight.join(" ")}
            </p>
        );
    }
});

var LyricPrompt = React.createClass({
    handleBlur: function (e) {
        var currentValue = this.refs.prompt.getDOMNode().value.trim();
        if (currentValue != "") {
            this.props.onLoseFocus(currentValue);
        }
    },

    render: function() {
        return (
            <input type="text" size={this.props.word.length} onBlur={this.handleBlur} ref="prompt"></input>
        );
    }
});

var ScoreCard = React.createClass({
    render: function() {
        return (<span>{this.props.score} / 10</span>);
    }
});


React.render(
  <LyricList lyricLines={lyricLines} />,
  document.getElementById('example')
);

React.render(
  <ScoreCard score={0} />,
  document.getElementById('score')
);
