var LyricList = React.createClass({
    getInitialState: function() {
        return { score: 0 };
    },

    updateScore: function(amount) {
        this.setState({ score: this.state.score + amount });
    },

    render: function() {
        var lyricNodes = this.props.lyricLines.map(function(lyricLine) {
            return (
                <LyricLine lyric={lyricLine.lyric}
                           missingWord={lyricLine.missingWord}
                           updateScore={this.updateScore}/>
            );
        }.bind(this));
        return ( <div> {lyricNodes} <ScoreCard score={this.state.score} /> </div> );
    }
});

var LyricLine = React.createClass({
    getInitialState: function() {
        return { currentValue: null };
    },

    onLoseFocus: function (value) {
        this.setState({
            currentValue: value,
        });
        this.props.updateScore(this.isCorrect(value) ? 1 : 0);
    },

    isCorrect: function(value) {
        var correctAnswer = this.props.lyric.split(" ")[this.props.missingWord];
        return (value == correctAnswer);
    },

    render: function() {
        var words = this.props.lyric.split(" ");
        var wordsLeft = words.slice(0, this.props.missingWord);
        var wordsRight = words.slice(this.props.missingWord + 1);
        var wordToReplace = words[this.props.missingWord];
        return (
            <p>
                {wordsLeft.join(" ")} 
                <LyricPrompt word={wordToReplace} wordGuessed={this.state.currentValue} onLoseFocus={this.onLoseFocus}/>
                {wordsRight.join(" ")}
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
        if (!this.props.wordGuessed) {
            return (<input type="text" size={this.props.word.length} onBlur={this.handleBlur} ref="prompt"></input>);
        } else if (this.props.wordGuessed == this.props.word) {
            return (<span className="answer-right">{this.props.word}</span>);
        } else {
            return (
                <span>
                    <span className="answer-wrong">{this.props.wordGuessed}</span> <span className="answer-correction">{this.props.word}</span>
                </span>
            );
        }
    }
});

var ScoreCard = React.createClass({
    render: function() {
        return ( <div id="score"> {this.props.score} / 10 </div> );
    }
});


React.render(
  <LyricList lyricLines={lyrics} />,
  document.getElementById('container')
);
