class TarefasController {

    constructor(formIdCreate, tableId) {

        this.formElement = document.getElementById(formIdCreate);
        this.tableElement = document.getElementById(tableId);

        this.onSubmit();
        this.selectAll();
        this.addEventsButtons();
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
                                <input type="checkbox" id="terminadas-check" class="checkboxes" name="${dataTarefa.nomeTarefa}">
                            </th>
                            <td name="${dataTarefa.nomeTarefa}">${dataTarefa.nomeTarefa}</td>
                            <td name="${dataTarefa.nomeTarefa}">${dataTarefa._dataPrazo}</td>
                        </tr>`;

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

        [...document.querySelectorAll('.checkboxes')].forEach((elem) => {
            elem.addEventListener("click", e => {
                this.finalizaTarefa(e.target || e.srcElement);

            });
        });

        document.querySelector("#mostrar-terminadas").addEventListener("click", b => {
            this.mostrarFinalizadas();
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

    finalizaTarefa(dataTarefa) {

        //console.log(dataTarefa);
        let txtName = dataTarefa.getAttribute("name");
        let element = document.getElementsByName(txtName);

        if (dataTarefa.checked == true) {

            element[1].setAttribute("class", "terminado");
            element[2].setAttribute("class", "terminado");

        } else {

            element[1].setAttribute("class", "");
            element[2].setAttribute("class", "");

        }

        var x = dataTarefa.parentElement;
        var y = x.parentElement;

        y.style.display = 'none';


    }

    mostrarFinalizadas(){

        let x = document.getElementsByClassName("terminado");
        let btn = document.getElementById("mostrar-terminadas");     

        if(btn.checked == true){

            for(let i = 0; i < x.length; i++){

                let y = x[i].parentElement;
    
                y.style.display = 'table-row';
    
                console.log(y);
            }

        }else{
            for(let i = 0; i < x.length; i++){

                let y = x[i].parentElement;
    
                y.style.display = 'none';
    
                console.log(y);
            }
        }      

        
    }

}