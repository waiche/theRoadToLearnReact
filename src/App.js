import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

console.log(url);

const isSearched = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDissmiss = this.onDissmiss.bind(this);
    }

    setSearchTopStories(result) {
        this.setState({result});
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value})
    }

    onDissmiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId)
        this.setState({
            //result: Object.assign({}, this.state.result, {hits: updatedHits}),
            result: {...this.state.result, hits:updatedHits}
        });
    }


    componentDidMount() {
        const {searchTerm} = this.state;

        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }


    render() {
        const {searchTerm, result} = this.state
        if (!result) {
            return null;
        }
        return (
            <div>
                <Table
                list={result.hits}
                pattern={searchTerm}
                onDismiss={this.onDissmiss}
                />
            </div>

        )
    }
}

const Search = ({value, onChange, children}) => {
    // do something
    return (
        <form>
            {children} <input
            type="text"
            value={value}
            onChange={onChange}
        />
        </form>
    )
}

const largeColum = {
    width: '40%',
};

const midColum = {
    width: '30%',
};

const smallColum = {
    width: '10%',
};


const Table = ({list, pattern, onDismiss}) =>
    <div className="table">
        {list.filter(isSearched(pattern)).map(item =>
            <div key={item.objectID} className="table-row">
                    <span style={largeColum}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                <span style={midColum}>
                        {item.title}
                    </span>
                <span style={smallColum}>
                        {item.author}
                    </span>
                <span style={smallColum}>
                        {item.num_comment}
                    </span>
                <span style={smallColum}>
                        {item.points}
                    </span>
                <span style={smallColum}>
                        <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
                            Dismiss
                        </Button>
                    </span>
            </div>)}
    </div>

const Button = ({onClick, className = '', children}) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type="button"
        >
            {children}
        </button>
    )
}

export default App;
