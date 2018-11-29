class TarefasController {

    constructor(formIdCreate, tableId, tableFinalizadasId) {

        this.formElement = document.getElementById(formIdCreate);
        this.tableElement = document.getElementById(tableId);
        this.tableFinalizadas = document.getElementById(tableFinalizadasId);

        this.onSubmit();
        this.selectAll();
        this.addEventsButtons();
    }

    onSubmit() {

        this.formElement.addEventListener("submit", event => {

            event.preventDefault(); //cancela comportamento padrão do forumalario

            let values = this.getValues(this.formElement); //guarda valores da formulario na variavel values
            let btn = this.formElement.querySelector(".btn-nova-tabela"); //guarda o botão submit na variavel btn

            btn.disabled = true; //desabilita botão para que não haja duplicação de dados.

            if (!values) {
                document.querySelector("#error").style.display = "block";
                this.formElement.reset();
                btn.disabled = false;
                return false; //se valores forem vaziu retorna um false. 
            }

            values.save(); //salva os dados.
            this.addLine(values); //adiciona os valores na lista
            this.formElement.reset(); //reseta o formulario.
            btn.disabled = false; //habilita o botão novamente para um novo envio de dados.
            this.showList();
            document.querySelector("#error").style.display = "none";
            document.querySelector(".alert-success").style.display = "block";

        });
    }

    getValues(formElement) {

        let tarefa = {};
        let isValid = true;

        [...formElement.elements].forEach(function (field, index) {

            if (['nomeTarefa', 'dataPrazo'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('is-invalid');
                isValid = false;

            } else {
                tarefa[field.name] = field.value;
            }

        });

        if (!isValid) {
            return false;
        }

        return new Tarefa(
            tarefa.nomeTarefa,
            tarefa.dataPrazo,
            tarefa.terminada = false
        );
    }

    selectAll() {

        let tarefas = Tarefa.getTarefaStorage();

        tarefas.forEach(dataTarefa => {

            let tarefa = new Tarefa();

            tarefa.loadFromJSON(dataTarefa);

            this.addLine(tarefa);

        });

    }

    addLine(dataTarefa) {

        let tr = this.getTr(dataTarefa);

        if (dataTarefa._terminada) {

            this.tableFinalizadas.appendChild(tr);

        } else {

            this.tableElement.appendChild(tr);

        }

    }

    //table row
    getTr(dataTarefa, tr = null) {

        if (tr === null) tr = document.createElement('tr');

        tr.dataset.tarefa = JSON.stringify(dataTarefa);

        if (dataTarefa._terminada) {

            tr.innerHTML = `<tr>
                            <th scope="row">
                                <input type="checkbox" id="${dataTarefa._id}" class="checkbox-finaliza" name="${dataTarefa.nomeTarefa}" checked>
                            </th>
                            <td class="terminado" name="${dataTarefa.nomeTarefa}">${dataTarefa.nomeTarefa}</td>
                            <td class="terminado" name="${dataTarefa.nomeTarefa}">${dataTarefa._dataPrazo}</td>
                        </tr>`;

        } else {

            tr.innerHTML = `<tr>
                            <th scope="row">
                                <input type="checkbox" id="${dataTarefa._id}" class="checkbox-finaliza" name="${dataTarefa.nomeTarefa}">
                            </th>
                            <td class="" name="${dataTarefa.nomeTarefa}">${dataTarefa.nomeTarefa}</td>
                            <td class="" name="${dataTarefa.nomeTarefa}">${dataTarefa._dataPrazo}</td>
                        </tr>`;

        }

        this.addEventTr(tr);

        return tr;

    }

    addEventTr(tr) {

        tr.querySelector(".checkbox-finaliza").addEventListener("click", e => {

            var json = localStorage.getItem("tarefas"); //pega minhas tarefas do local storage e coloca na variavel json

            json = JSON.parse(json); //parse converte o json de String para array JSON

            for (let i = 0; i < json.length; i++) {

                if (e.target.id == json[i]._id) {

                    if (json[i]._terminada == false) {
                        json[i]._terminada = true;
                        tr.setAttribute("class", "terminado");
                        document.getElementById("table-tarefas-finalizadas").appendChild(tr);

                    } else {
                        json[i]._terminada = false;
                        tr.setAttribute("class", "");
                        document.getElementById("table-tarefas").appendChild(tr);

                    }


                }
            }

            json = JSON.stringify(json); //converte o json para string

            localStorage.setItem("tarefas", json); //devolve meu json para tarefas no localstorage

        });

    }


    addEventsButtons() {

        document.querySelector("#tabela .btn-info").addEventListener("click", e => {

            this.showPanelCreate();

        });

        document.querySelector("#nova-tarefa .btn-cancelar").addEventListener("click", c => {

            document.querySelector("#error").style.display = "none";
            this.formElement.reset();
            this.showList();

        });

        document.querySelector("#mostrar-terminadas").addEventListener("click", b => {
            this.mostrarFinalizadas();
        });

        document.querySelector(".btn-deletar").addEventListener("click", e => {
            if (confirm("deseja realmente excluir?")) {

                let tarefas = JSON.parse(localStorage.getItem("tarefas"));

                tarefas.slice(0).forEach((tarefaData, index) => {

                    if (tarefaData._terminada == true) {
                        
                        document.querySelector(".alert-remover").style.display = "block";
                        tarefas.splice(tarefas.indexOf(tarefaData), 1);                       
                        var x = document.getElementById(tarefaData._id).parentElement;
                        x.parentElement.remove();
                    }

                });

                localStorage.setItem("tarefas", JSON.stringify(tarefas));

            }
        })

    }

    //mostra/oculta painel para criação de tarefa
    showPanelCreate() {
        
        //alerts
        document.querySelector(".alert-remover").style.display = "none";
        document.querySelector(".alert-success").style.display = "none";

        document.querySelector("#nova-tarefa").style.display = "block";
        document.querySelector("#tabela").style.display = "none";

    }
    //mostra/oculta lista de tarefas
    showList() {

        document.querySelector("#nova-tarefa").style.display = "none";
        document.querySelector("#tabela").style.display = "block";

    }

    mostrarFinalizadas() {

        if (document.querySelector("#tabela-finalizadas").style.display == "none") {

            document.querySelector("#tabela-finalizadas").style.display = "block";

        } else {

            document.querySelector("#tabela-finalizadas").style.display = "none";

        }



    }

}