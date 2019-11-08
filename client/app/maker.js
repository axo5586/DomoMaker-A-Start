const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val == '' || $("#domoAge").val() == '' || $("#domoLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
}

const handleDomoLevel = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName2").val == '' || $("#domoLevel2").val() == ''){
        handleError("RAWR! Name and levels are required!");
        return false;
    }

    sendAjax('POST', $("#levelForm").attr("action"), $("#levelForm").serialize(), function() {
        loadDomosFromServer();
    });

    console.log('handleDomoLevel called');

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm" name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="level">Level: </label>
            <input id="domoLevel" type="text" name="level" placeholder="Domo Level" />
            <input type="hidden" name="_csrf" value={props.csrf} />            
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props){
    if(props.domos.length === 0){
        return(
            <div className = "domoList">
                <h3 className = "emptyDomo">No Domos yet</h3>
            </div>
        )
    }

    const domoNodes = props.domos.map(function(domo){
        return(
            <div key = {domo._id} className = "domo">
                <img src="assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className = "domoName"> Name: {domo.name} </h3>
                <h3 className = "domoAge"> Age: {domo.age} </h3>
                <h3 className = "domoLevel"> Level: {domo.level} </h3>
            </div>
        );
    });

    return (
        <div className = "domoList">
            {domoNodes}
        </div>
    );
};

const DomoAddLevel = (props) => {
    return (
        <form id="levelForm" name="levelForm"
            onSubmit={handleDomoLevel}
            action="/addDomoLevel"
            method="POST"
            className="domoForm"
        >

            <label htmlFor="domoName2">Name: </label>
            <input id="name" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="level">Levels: </label>
            <input id="domoLevel2" type="text" name="level" placeholder="Levels to add to domo" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Add Level" />      
        </form>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    ReactDOM.render(
        <DomoAddLevel csrf={csrf} />, document.querySelector("#domoAddLevel")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});