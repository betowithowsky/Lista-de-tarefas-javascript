class Tarefa {

    constructor(nomeTarefa, dataPrazo, terminada) {

        this._id;
        this._nomeTarefa = nomeTarefa;
        this._dataPrazo = dataPrazo;
        this._terminada = terminada;
        this._dataRegistro = new Date();

    }

    get id() {
        return this._id;
    }

    get terminada() {
        return this._terminada;
    }

    get dataTarefa() {
        return this._dataPrazo;
    }

    set name(name) {
        this._name = name;
    }

    get nomeTarefa() {
        return this._nomeTarefa;
    }

    set nomeTarefa(nomeTarefa) {
        this._nomeTarefa = nomeTarefa;
    }

    loadFromJSON(json) {
        for (let nomeTarefa in json) {

            switch (nomeTarefa) {
                case '_dataRegistro':
                    this[nomeTarefa = new Date(json[name])];
                    break;
                default:
                    this[nomeTarefa] = json[nomeTarefa]
            }
        }
    }

    static getTarefaStorage() {

        let tarefas = [];

        if (localStorage.getItem("tarefas")) {
            tarefas = JSON.parse(localStorage.getItem("tarefas"));
        }

        return tarefas;

    }

    getNewID() {

        let tarefasID = parseInt(localStorage.getItem("tarefasID"));

        if (!tarefasID > 0) tarefasID = 0;

        tarefasID++;

        localStorage.setItem("tarefasID", tarefasID);

        return tarefasID;

    }

    save() {

        let tarefas = Tarefa.getTarefaStorage();

        if (this.id > 0) {

            tarefas.map(t =>{
                
                if(t._id == this.id){

                    Object.assign(t, this);

                }

                return t;
                
            });


        } else {
            this._id = this.getNewID();

            tarefas.push(this);
            
        }

        localStorage.setItem("tarefas", JSON.stringify(tarefas));       

    }

    remove(){

        let tarefas = Tarefa.getTarefaStorage();

        tarefas.forEach((tarefaData, index) => {

            if(tarefaData._terminada == true){   
                //console.log(tarefaData);
                tarefas.splice(index, 1);

            }

        });

        localStorage.setItem("tarefas", JSON.stringify(tarefas));

    }



}