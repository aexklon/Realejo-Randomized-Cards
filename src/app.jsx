// imports are being handled during build time by gulp-webpack
import React from 'react'
import ReactDOM from 'react-dom'

(function boot() {
	// this function will boot the application by requesting data from a URL
	// specified in the ajax request. The reponse must be a JSON array populated
	// with objects like this one:
	/*{
		"id": "1", 					// unique identifier of the current object, could be referenced by other objects
		"nextId": "3", 			// optional unique identifier of the next object, if present will be rendered as an anchor to the next object at the end of the card content
		"previousId": "2",	// optional unique identifier of the previous object, if present will be rendered as an anchor to the previous object at the beginning of the card content
		"heig.": "14", 			// optional specifier, not currently rendered
		"color": "pink",		// optional specifier, rendered as a thematic css class. See app-theme.scss for all thematic classes
		"special": "pre",		// optional specifier, rendered as a structural css class. See app.scss .card for all specials
												// Content (below) will be rendered as the main text in the card
		"content": "Do you see any Teletubbies in here? Do you see a slender plastic tag clipped to my shirt with my name printed on it? Do you see a little Asian child with a blank expression on his face sitting outside on a mechanical helicopter that shakes when you put quarters in it? No? Well, that's what you see at a toy store. And you must think you're in a toy store, because you're here shopping for an infant named Jeb."
	}*/
	$.getJSON({
	  url: 'demo.json',
	  success: function(data){
	    ReactDOM.render(<Cards data={data} />, document.getElementById('cards'))
	  },
	  error: function(err){
			ReactDOM.render(<Error error={err} />, document.getElementById('cards'))
	  }
	})
})()

const _point = {
	card: function() {
		// When a nextId or previousId anchor is clicked, this function srolls to
		// the target href and animates it, pointing to the user exactly which card
		// is referred. It is usefull when multiple columns are rendered
		$('.card__arrow').click(function(e){
			e.preventDefault()
			var target = $($(this).attr('href'))
				target.removeClass('animated bounce')
				$('html, body').animate({
					scrollTop: target.offset().top-20,
					duration: 1000,
					easing: "easeIn"
				})
				setTimeout(()=>target.addClass('animated bounce'), 200)
				return false
		})
	},
	btnNav: function() {
		// When a .btn--nav is clicked, this function scroll to its href target
		$('.btn--nav').click(function(e){
			e.preventDefault()
			var target = $($(this).attr('href'))
				$('html, body').animate({
					scrollTop: target.offset().top-20,
					duration: 1000,
					easing: "easeIn"
				})
				return false
		})
	}
}

class Error extends React.Component {
	render() {
		console.error('error', this.props.error)
    return (
			<article className="container mt-3">
				<div className="alert alert-danger text-center" role="alert">
				  Application data could not be fetched
				</div>
			</article>
    )
  }
	componentDidMount() {_point.card()}
}
class Cards extends React.Component {
	// This is the container for every card rendered.
	// It also shuffles the cards every time it is called.
	_shuffle(o){
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
	};
	render() {
		const{ data } = this.props
		const dataShuffled = this._shuffle(data)
    return (
			<article>
				<Header />
				<main className="card-columns mb-1">
					{
						dataShuffled
						.map((card, i)=><Card card={card} key={i}/>)
					}
				</main>
				<Footer />
			</article>
    )
  }
	componentDidMount() {_point.card()}
}
class Header extends React.Component {
	render() {
		return(
			<header id="header" className="hero jumbotron jumbotron-fluid mb-3">
				<div className="hero__text">
					<h1 className="hero__text--title display-3">Realejo Randomized Cards</h1>
					<p className="hero__text--lead"><i>Lorem ipsum dolor sit amet, ne vim eros oratio mollis,</i></p>
					<p className="hero__text--paragraph">quo ad mundi dolor. Ut tamquam lobortis est, id vix iisque senserit postulant. Quot dicam vel an. Mei recteque repudiare id, mel invenire facilisis ea, nam bonorum probatus an. Ex eos iudico invenire definiebas, nostrum pertinacia voluptatibus ut pri. Etiam homero periculis an eum, has ex graeco quaerendum.</p>
					<a role="button" className="btn btn--nav btn-secondary" href="#footer">footer</a>
				</div>
			</header>
		)
	}
	componentDidMount() {_point.btnNav()}
}
class Footer extends React.Component {
	render() {
		return(
			<footer id="footer" className="footer jumbotron jumbotron-fluid mt-5 mb-0">
				<div className="footer__text">
					<a role="button" className="btn btn--nav btn-secondary" href="#header">header</a>
					<p className="hero__text--lead"><i>Lorem ipsum dolor sit amet, ne vim eros oratio mollis,</i></p>
					<p className="footer__text--paragraph">Lorem ipsum dolor sit amet, ne vim eros oratio mollis, quo ad mundi dolor. Ut tamquam lobortis est, id vix iisque senserit postulant. Quot dicam vel an. Mei recteque repudiare id, mel invenire facilisis ea, nam bonorum probatus an. Ex eos iudico invenire definiebas, nostrum pertinacia voluptatibus ut pri. Etiam homero periculis an eum, has ex graeco quaerendum.</p>
				</div>
			</footer>
		)
	}
	componentDidMount() {_point.btnNav()}
}
class Card extends React.Component {
  render() {
		const { id, previousId, nextId, title, content, color, special } = this.props.card
		// This properties are all retrieved from the fetched data, a deeper
		// explanation can be found in this file, inside the boot function

		const classCardColor = color ? "card--"+color.toLowerCase() : null
		const classCardSpecial = special ? "card--"+special.toLowerCase() : null
		const classCardIfNoTitleOrPrevId = !title && !previousId ? "card--no-title--no-previous-id" : null
		const classes = ["card", "card-block", "card-inverse", classCardColor, classCardSpecial, classCardIfNoTitleOrPrevId].join(' ').trim()
		//  Classes, applied to the card. They perform visual customizations.
		//  Open app.scss and app-theme.scss for a details

		const _contentParser = str => (/\r\n/g).test(str) ? str.split("\r\n") : str
		const contentParsed = _contentParser(content)
		// Content, parsed from json to html
		// During render, its constructor (array/string) will be tested to
		// determine if it should be treated as single o multiple spans/paragraphs

    return (
			<section id={id} className={classes}>

				{title ?
					<p className="card__p card__p--title"><strong>{title}</strong></p>
				: null}

				{previousId ?
					<a className="card__arrow card__arrow--previous" href={'#'+previousId}>
						<i className="fa fa-caret-right" aria-hidden="true" title="Ler a parte anterior">
							<span className="sr-only">Ler a parte anterior</span>
						</i>
					</a>
				: null}

				{contentParsed.constructor === Array ?
					<div className="card__p card__p--inline card__p--mutipleParagraphs">
						{contentParsed.map(
							(text, i)=>
								<span className="card__p-text" key={i}>
									{text}
									{i===contentParsed.length-1 ? null : <br />}
								</span>
						)}
					</div>
				:	<div className="card__p card__p--inline card__p--singleParagraph">
							<span className="card__p-text">{contentParsed}</span>
					</div>}

				{nextId ?
					<a className="card__arrow card__arrow--next" href={'#'+nextId}>
						<i className="fa fa-caret-right" aria-hidden="true" title="Ler a próxima parte">
							<span className="sr-only">Ler a próxima parte</span>
						</i>
					</a>
				: null}

			</section>
    )
  }
}
