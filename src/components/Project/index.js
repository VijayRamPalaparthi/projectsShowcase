import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Project extends Component {
  state = {
    activeCategory: categoriesList[0].id,
    projectsList: [],
    apiStatus: 'initial',
  }

  componentDidMount = () => {
    this.getProjects()
  }

  getProjects = async () => {
    const {activeCategory} = this.state
    this.setState({apiStatus: 'loader'})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeCategory}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({projectsList: updatedData, apiStatus: 'success'})
    } else {
      this.setState({apiStatus: 'failure'})
    }
  }

  onChangeOption = event => {
    this.setState({activeCategory: event.target.value}, this.getProjects)
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" width={50} height={50} />
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    console.log(projectsList)
    return (
      <ul className="list-container">
        {projectsList.map(each => (
          <li className="card" key={each.id}>
            <img src={each.imageUrl} alt={each.name} className="card-image" />
            <p className="card-name">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  retry = () => {
    this.getProjects()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="fail-heading">Oops! Something Went Wrong</h1>
      <p className="desc">
        {' '}
        We cannot seem to find the page you are looking for{' '}
      </p>
      <button className="retry" type="button" onClick={this.retry}>
        {' '}
        Retry
      </button>
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'loader':
        return this.renderLoaderView()
      case 'success':
        return this.renderSuccessView()
      case 'failure':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state

    return (
      <div className="bg-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="body-container">
          <select
            className="select"
            value={activeCategory}
            onChange={this.onChangeOption}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id} className="option">
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderSwitch()}
        </div>
      </div>
    )
  }
}

export default Project
