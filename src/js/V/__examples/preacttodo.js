import VComponent from "../VRDOM/component/VComponent"

export default class PreactTodoList extends VComponent {
    state = {todos: [], text: ''};
    setText = e => {
        this.setState({text: e.target.value});
    };
    addTodo = () => {
        let {todos, text} = this.state;
        todos = todos.concat({text});
        this.setState({todos, text: ''});
    };

    render() {
        return (
            <form onSubmit={this.addTodo} action="javascript:">
                <input value={this.state.text} onInput={this.setText}/>
                <button type="submit">Add</button>
                <ul>
                    {this.state.todos.map(todo => (
                        <li>{todo.text}</li>
                    ))}
                </ul>
            </form>
        );
    }
}
