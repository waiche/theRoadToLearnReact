import React, {Component} from 'react';
import './App.css';

const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comment: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comment: 2,
        points: 5,
        objectID: 1,
    }
]

const array = [1, 4, 9, 16]
const newArray = array.map(function (x) {
    return x * 2
});

const isSearched = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list,
            searchTerm: '',
        };
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value})
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedList = this.state.list.filter(isNotId);
        this.setState({list: updatedList});
    }

    render() {
        const {list, searchTerm} = this.state
        return (
            <div className="App">
                <Search
                    value={searchTerm}
                    onChange={this.onSearchChange}

                >
                    Search
                </Search>
                <Table
                    list={list}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
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

const Table = ({list, pattern, onDismiss}) => {
    return (
        <div>
            {list.filter(isSearched(pattern)).map(item =>
                <div key={item.objectID}>
                    <span>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span>{item.title}</span>
                    <span>{item.author}</span>
                    <span>{item.num_comment}</span>
                    <span>{item.points}</span>
                    <span>
                        <Button onClick={() => onDismiss(item.objectID)}>
                            Dismiss
                        </Button>

                    </span>

                </div>)}
        </div>
    )
}

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
