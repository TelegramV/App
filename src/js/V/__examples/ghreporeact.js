import VComponent from "../VRDOM/component/VComponent"

const SEARCH = 'https://api.github.com/search/repositories';

export class PreactGHExample extends VComponent {
    state = {
        items: []
    }

    componentDidMount() {
        fetch(`${SEARCH}?q=preact`)
            .then(res => res.json())
            .then(data => this.setState({items: (data && data.items) || []}));
    }

    render() {
        return (
            <div>
                <h1 style="text-align:center; font-weight: 200">Example</h1>
                <div className="list">
                    {this.state.items.map(result => (
                        <Result {...result} />
                    ))}
                </div>
            </div>
        )
    }
}

const Result = result => (
    <div class="repl-list-item">
        <div>
            <a
                href={result.html_url}
                target="_blank"
                rel="noopener noreferrer"
                class="repl-link"
            >
                {result.full_name}
            </a>
            {" - "}
            <strong>{result.stargazers_count}</strong>
        </div>
        <p>{result.description}</p>
    </div>
);
