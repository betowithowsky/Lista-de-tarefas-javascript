class TarefasController {

    constructor(formIdCreate, tableId) {

        this.formElement = document.getElementById(formIdCreate);
        this.tableElement = document.getElementById(tableId);

        this.onSubmit();
        this.selectAll();
        this.addEventsButtons();
        this.detectCheckBox();
    }

    onSubmit() {

        this.formElement.addEventListener("submit", event => {

            event.preventDefault(); //cancela comportamento padrão do forumalario

            let values = this.getValues(this.formElement); //guarda valores da tabela na variavel values
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

        this.tableElement.appendChild(tr);

    }

    //table row
    getTr(dataTarefa, tr = null) {

        if (tr === null) tr = document.createElement('tr');

        tr.dataset.tarefa = JSON.stringify(dataTarefa);

        tr.innerHTML = `<tr>
        <th scope="row">
            <input type="checkbox" id="terminadas-check" class="modifier" name="${dataTarefa.nomeTarefa}">
            </th>
            <td>${dataTarefa.nomeTarefa}</td>
            <td>${dataTarefa._dataPrazo}</td>
      </tr>`;

        //this.addEventsTr(tr);

        return tr;

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
    }

    //mostra/oculta painel para criação de tarefa
    showPanelCreate() {

        document.querySelector("#nova-tarefa").style.display = "block";
        document.querySelector("#tabela").style.display = "none";

    }
    //mostra/oculta lista de tarefas
    showList() {

        document.querySelector("#nova-tarefa").style.display = "none";
        document.querySelector("#tabela").style.display = "block";
    }

    detectCheckBox() {

        var check = document.getElementsByName("itemCheck");

        for (var i = 0; i < check.length; i++) {
            if (check[i].checked == true) {
                // CheckBox Marcado... Faça alguma coisa...

            } else {
                // CheckBox Não Marcado... Faça alguma outra coisa...
            }
        }
    }

}