var elements = {};

function div(name, props, children) {
	let state = elements[name];
	if (!state) {
		state = elements[name] = 
			{ elem: document.createElement("div"), props: {}, name: name, children: [], content: null};
	}
	for (let prop in props) {
		if (Reflect.getOwnPropertyDescriptor(props, prop)) {
			if (state.props[prop] != props[prop]) {
				state.props[prop] = props[prop];
				state.elem[prop] = props[prop];
			}
		}
	}
	if (typeof(children) == "string") {
		if (state.content != children) {
			state.content = children;
			state.elem.innerHTML = children;
		}
	} else {
		for (let child of children) {
			if (!state.children.find(x => x == child)) {
				state.children.push(child);
				state.elem.appendChild(child);
			}
		}
		for (let child of state.children) {
			if (!children.find(x => x == child)) {
				state.children.splice(state.children.indexOf(child), 1);
				state.elem.remove(child);
			}
		}
	}
	return state.elem;
}

function mount(container, elem) {
	let found = false;
	for (let child of container.children) {
		if (child == elem) {
			found = true;
		}
	}
	if (!found) {
		container.appendChild(elem);
	}
}

class MyComponent {
	
	constructor() {
		setInterval(()=> this.render(), 1000);
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(){
		this.flag = !this.flag;
		this.render();
	}

	render() {
	    return (
			div("my-div", {}, [
			  div("text", {className: "date"}, 
				"Current time: " + (new Date()).toString()
			  ),
			  div("class-change", {className: this.flag ? "foo" : "bar", onclick: this.onClick },
				"Click me!"
			  )
			])
		);
	}
}

mount(document.getElementById("container"),
	(new MyComponent()).render()
);