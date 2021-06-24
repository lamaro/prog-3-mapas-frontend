$(document).ready(function () {

    //FORMULARIO ALTA
    $("#form_alta").validate({
        rules: {
            "nombre": {
                required: true
            },
            "descripcion": {
                required: true
            },
            "latitud": {
                required: true
            },
            "longitud": {
                required: true
            }
        },
        messages: {
            "nombre": "Ingresa tu nombre",
            "descripcion": "Ingresa una descripcion",
            "latitud": "Ingresa la latitud",
            "longitud": "Ingresa la longitud",
        },

        submitHandler: function (form) {
            //$(form).submit();
            $.ajax({
                url: form.action,
                type: form.method, //POST
                data: $(form).serialize(),
                beforeSend: function () {
                    $('#respuesta_form').html('Espere...');
                },
                success: function (response) {
                    console.log(response)
                    $('#respuesta_form').html('Gracias por agregar un marcador :)');
                }
            })
        }
    });

    //FORMULARIO ALTA
    $("#form_edit").validate({
        rules: {
            "nombre": {
                required: true
            },
            "descripcion": {
                required: true
            },
            "latitud": {
                required: true
            },
            "longitud": {
                required: true
            }
        },
        messages: {
            "nombre": "Ingresa tu nombre",
            "descripcion": "Ingresa una descripcion",
            "latitud": "Ingresa la latitud",
            "longitud": "Ingresa la longitud",
        },

        submitHandler: function (form) {
            const id = $(form).find('input[name="_id"]').val()
            updateItem(id, $(form).serialize())

        }
    }); //aca cierra el validate


    //LISTADO

    const deleteItem = async (id) => {
        try {
            const response = await fetch(`https://prog-3-mapa-backend.vercel.app/markers/${id}`, {
                method: 'DELETE'
            })
            const data = await response.json()
            getListItems();

        } catch (error) {
            console.log(error)
        }
    }

    const fillForm = async id => {
        try {
            const response = await fetch(`https://prog-3-mapa-backend.vercel.app/marker/${id}`)
            const data = await response.json()

            const inputs = document.querySelector("#form_edit").elements;
            inputs["nombre"].value = data.nombre;
            inputs["descripcion"].value = data.descripcion;
            inputs["lat"].value = data.lat;
            inputs["lng"].value = data.lng;
            inputs["type"].value = data.type;
            inputs["_id"].value = data._id;
        } catch (error) {
            console.log(error)
        }
    }

    const updateItem = async (id, data) => {
        try {
            const response = await fetch(`https://prog-3-mapa-backend.vercel.app/markers/${id}`, {
                method: 'PUT',
                headers: new Headers({'content-type': 'application/x-www-form-urlencoded'}),
                body: data
            })
            const dataUpdated = await response.json()
            getListItems();

        } catch (error) {
            console.log(error)
        }
    }



    const Item = props => {
        const { _id, nombre, descripcion, lat, lng, type } = props
        return (
            `
            <div class="item">
                <p>${nombre}</p>
                <p>${descripcion}</p>
                <p>${lat}</p>
                <p>${lng}</p>
                <p>${type}</p>
                <button data-id=${_id} class="edit">Editar</button>
                <button data-id=${_id} class="delete">eliminar</button>
            </div>
        `
        )
    }

    const $list = document.querySelector('.list');

    const getListItems = async () => {
        $list.innerHTML = null;
        try {
            const response = await fetch(`https://prog-3-mapa-backend.vercel.app/markers`)
            const items = await response.json();

            items.forEach((item) => {
                $list.innerHTML += Item(item)
            })

            const $editButtons = document.querySelectorAll('.edit')
            $editButtons.forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    fillForm(el.dataset.id);
                })
            })

            const $deleteButtons = document.querySelectorAll('.delete')
            $deleteButtons.forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(el.dataset.id)
                    deleteItem(el.dataset.id)
                })
            })

        } catch (error) {
            console.log(error)
        }
    }
    getListItems();

})