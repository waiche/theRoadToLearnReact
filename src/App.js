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
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    fetchSearchTopStories(searchTerm) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(error => error);
    }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    setSearchTopStories(result) {
        this.setState({result});
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value})
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId)
        this.setState({
            //result: Object.assign({}, this.state.result, {hits: updatedHits}),
            result: {...this.state.result, hits: updatedHits}
        });
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.fetchSearchTopStories(searchTerm);

    }


    render() {
        const {searchTerm, result} = this.state;
        if (!result) {
            return null;
        }
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Search
                    </Search>
                </div>
                {result &&
                     <Table
                        list={result.hits}
                        onDismiss={this.onDismiss}
                    />
                }
            </div>

        )
    }
}

const Search = ({value, onChange, onSubmit, children}) => {
    // do something
    return (
        <form onSubmit={onSubmit}>
            <input
            type="text"
            value={value}
            onChange={onChange}
        />
        <button type="submit">
        {children}
        </button>
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


const Table = ({list, onDismiss}) =>
    <div className="table">
        {list.map(item =>
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
