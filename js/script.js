// CONSTANTS
const API = "http://localhost:3333/"

// CARREGA TABELA
$(document).ready(function(){
    loadTable()
})

// CARREGAMENTO DOS PRODUTOS
function loadTable(){
    $.get(`${API}products`).done(function(data){
        
        // ZERA TABELA
        $(".tabela .registros").html("")

        // POPULA TABELA
        data.forEach(product => {
            money = parseFloat(product.Price.Real + "." + product.Price.Decimal)

            money = money.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

            $(".tabela .registros").append(`
                <!-- tr -->
                <div class="tr">
                    <div class="td checkbox hidden">
                        <span><i class="material-icons">check_box</i></span>
                        <input type="checkbox" name="item" data-id="${product.ID}">
                    </div>

                    <div class="td">
                        <img src="${API}docs/${product.Path}">
                        <strong>${product.Name}</strong>
                    </div>
                    <div class="td"><strong>${product.Description}</strong></div>
                    <div class="td"><strong>${money}</strong></div>
                    <div class="td"><strong>${product.Quantity}</strong></div>
                    <div class="td">
                        <a class="btn-acao edit"><i class="material-icons">edit</i>Editar</a>
                    </div>
                </div>
            `)
        })

        

    }).fail(function(){
        setAlert("fail", "Erro ao carregar os registros.")
    })
}

// PESQUISA
$(".pesquisa .clear").click(function() {
    $("#search").val("")
})

// INPUT FOCUS
$("#search").focus(function() {
    $(".input-group i:nth-child(1)").addClass("focus")
})

// INPUT FOCUSOUT
$("#search").focusout(function() {
    $(".input-group i:nth-child(1)").removeClass("focus")
})

// FILTRA ITENS
$("#search").keyup(function() {
    search = $(this).val() != "" ? encodeURIComponent($(this).val()) : null

    $.get(`${API}/products/find/${search}`).done(function(data){
        
        // ZERA TABELA
        $(".tabela .registros").html("")

        // POPULA TABELA
        data.forEach(product => {
            money = parseFloat(product.Price.Real + "." + product.Price.Decimal)

            money = money.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

            $(".tabela .registros").append(`
                <!-- tr -->
                <div class="tr">
                    <div class="td checkbox hidden">
                        <span><i class="material-icons">check_box</i></span>
                        <input type="checkbox" name="item" data-id="${product.ID}">
                    </div>

                    <div class="td">
                        <img src="${API}docs/${product.Path}">
                        <strong>${product.Name}</strong>
                    </div>
                    <div class="td"><strong>${product.Description}</strong></div>
                    <div class="td"><strong>${money}</strong></div>
                    <div class="td"><strong>${product.Quantity}</strong></div>
                    <div class="td">
                        <a class="btn-acao edit"><i class="material-icons">edit</i>Editar</a>
                    </div>
                </div>
            `)
        })
    })
})


// ITEM CHECKBOX
$(document).on("click", ".tabela .tr", function(event){
    checked = $(".checkbox input", this).prop("checked")
    element = $(event.target)

    if(!element.is(".btn-acao.edit") && !element.is(".material-icons")){
        if(checked){
            $(".checkbox", this).addClass("hidden")
            $(".checkbox", this).addClass("animation")
            $(".checkbox input", this).prop("checked", false)
            $(".checkbox", this).removeClass("checked")
        } else {
            $(".checkbox", this).removeClass("hidden")
            $(".checkbox", this).removeClass("animation")
            $(".checkbox input", this).prop("checked", true)
            $(".checkbox", this).addClass("checked")
            $("span", this).html(`<i class="material-icons">check_box</i>`)
        }
    }
    
})

// CHEXKBOX ALL
$("#all").click(function(){
    checked = $("input", this).prop("checked")

    if(checked){
        // all
        $("input", this).prop("checked", false)
        $(this).removeClass("checked")
        $("span", this).html(`<i class="material-icons">check_box_outline_blank</i>`)

        // checkbox
        $(".td.checkbox").addClass("hidden")
        $(".checkbox input").prop("checked", false)
        $(".checkbox").removeClass("checked")
        
    } else {
        // all
        $("input", this).prop("checked", true)
        $(this).addClass("checked")
        $("span", this).html(`<i class="material-icons">check_box</i>`)

        // checkbox
        $(".checkbox").removeClass("hidden")
        $(".checkbox input").prop("checked", true)
        $(".checkbox").addClass("checked")
        $(".td.checkbox span").html(`<i class="material-icons">check_box</i>`)
    }
})

// MODALS
function modal(action){
    if(action == "show"){
        $(".container-modal").addClass("show")
        $("html").addClass("no-scroll")
    } else{
        $(".container-modal").removeClass("show")
        $("html").removeClass("no-scroll")
    }
}

// CLOSE MODAL
$(".exit").click(function(){
    modal("hide")
})

$(".container-modal").mousedown(function(event){
    element = $(event.target)
    
    if(element.is(".container-modal")){
        modal("hide")
    }
})

// LOADING
function loading(element, action){
    if(action == "show"){
        $(element).addClass("no-scroll")
        $(element).append(`<div class="container-loading">
        <div class="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>`)
    } else {
        $(element).removeClass("no-scroll")
        $(element + " .container-loading").remove()
    }
}

// INPUTS
$("input[name='preco']").maskMoney({prefix:'R$ ', allowNegative: true, thousands:'.', decimal:',', affixesStay: false})

$("input[type=file]").change(function(){
    if($(this)[0]["files"].length != 0){
        let name = $(this)[0]["files"][0]["name"]
        $("~ .file-input", this).html(name)
    } else{
        $("~ .file-input", this).html("Selecione uma imagem")
    }
})

// CREATE
$("#create").click(function(){
    resetForm()
    $(".modal").hide()
    $("#modalCreate").show()
    modal("show")
})

// CREATE
$("#modalCreate").submit(function(e){
    e.preventDefault()

    if(!validateNull("create")){
        setAlert("fail", "Preencha todos os campos")
    } else {

        data = new FormData(this)

        $.ajax({
            type: 'POST',
            url: "http://localhost:3333/product/create",
            data: data,
            cache: false,
            processData: false,
            contentType: false,
        }).done(function(data){
            data = JSON.parse(data)
            
            if(data){
                modal("hide")
                loadTable()
                setAlert("success", "Produto cadastrado com sucesso")
            } else{
                setAlert("error", "Ocorreu um erro ao cadastrar o produto")
            }

        }).fail(function(){
            setAlert("error", "Ocorreu um erro ao cadastrar o produto")
        })

    }
})

// EDIT
$(document).on("click", ".edit", function(){
    id = $("input[name='item']", $(this).closest(".tr")).data("id")
    setData(id)
    $("#id-edit").val(id)

    $(".modal").hide()
    $("#modalEdit").show()
    modal("show")
})

$("#modalEdit").submit(function(e){
    e.preventDefault()

    if(!validateNull("edit")){
        setAlert("fail", "Preencha todos os campos")
    } else {
        data = new FormData(this)
    
        $.ajax({
            type: 'PUT',
            url: "http://localhost:3333/product/edit",
            data: data,
            crossDomain: true,
            processData: false,
            contentType: false,
        }).done(function(data){
            data = JSON.parse(data)
            
            if(data){
                modal("hide")
                loadTable()
                setAlert("success", "Produto editado com sucesso")
            } else{
                setAlert("error", "Ocorreu um erro ao editar o produto")
            }
    
        }).fail(function(){
            setAlert("error", "Ocorreu um erro ao editar o produto")
        })
    }

})

function setData(id){

    loading("#modalEdit", "show")
    
    $.get(`${API}product/show/${id}`).done(function(data){
        $("#modalEdit .file-input").html(data.Image)
        $("#nome-edit").val(data.Name)
        $("#descricao-edit").val(data.Description)
        $("#preco-edit").val(data.Price.Real + "," + data.Price.Decimal)
        $("#quantidade-edit").val(data.Quantity)
        loading("#modalEdit", "hide")
    }).fail(function(){
        modal("hide")
        loading("#modalEdit", "hide")
        setAlert("error", "Erro ao tentar editar!")
    })
    
}

// DELETE
$("#delete").click(function(){
    resetForm()
    
    let id = []

    $("input[name='item']:checked").each(function(){
        id.push($(this).data("id"))
    })
    
    $("#id-delete").val(id)

    if(id.length != 0) {
        $(".modal").hide()
        $("#modalDelete").show()
        modal("show")
    } else{
        setAlert("fail", "Nenhum item selecionado")
    }
})

$("#modalDelete").submit(function(e){
    e.preventDefault()

    id = $("#id-delete").val()
    
    $.ajax({
        type: 'DELETE',
        url: "http://localhost:3333/product/delete/" + id,
        crossDomain: true,
    }).done(function(data){
        data = JSON.parse(data)
        
        if(data){
            modal("hide")
            loadTable()
            setAlert("success", "Produto excluído com sucesso")
        } else{
            setAlert("error", "Ocorreu um erro ao editar o produto")
        }

    }).fail(function(){
        setAlert("error", "Ocorreu um erro ao editar o produto")
    })
})



// VALIDATIONS
function validateNull(action){
    let validate = false
    let imagemCreate, nome, descricao, preco, quantidade

    if(action == "create"){
        imagemCreate = $("#imagem-create").val() 
        nome = $("#nome-create").val() 
        descricao = $("#descricao-create").val() 
        preco = $("#preco-create").val() 
        quantidade = $("#quantidade-create").val()
    } else {
        nome = $("#nome-edit").val() 
        descricao = $("#descricao-edit").val() 
        preco = $("#preco-edit").val() 
        quantidade = $("#quantidade-edit").val()
    }

    if(imagemCreate != "" && nome != "" && descricao != "" && preco != "" && quantidade != ""){
        validate = true
    }

    return validate
}

// ALERTS
function setAlert(type, message){
    if($(".alert").length == 0){
        if(type == "success"){
            $("body").prepend(`
            <div class="alert success">
                <i class="material-icons">done</i>
                <span>${message}</span>
            </div>
            `)
        } else{
            $("body").prepend(`
            <div class="alert fail">
                <i class="material-icons">close</i>
                <span>${message}</span>
            </div>
            `)
        }
    
        setTimeout(() => {
            $(".alert").remove()
        }, 3000);
    }
}

// RESET
function resetForm(){
    $(".modal .body input, .modal .body textarea").val("")
    $(".modal .body .file-input").html("Selecione uma imagem")
}