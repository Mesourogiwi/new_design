var products = []
var prod = []
$(document).ready(function () {


    async function getContent() {
        try {
            const response = await fetch("http://localhost:3333/topics", {
                method: 'get'
            });
            const data = await response.json();
            console.log(data);
            showAll(data);
        } catch (error) {
            console.log(error);
        }
    }
    getContent();
    $('#topic').SumoSelect();


    function showAll(topics) {

        for (let i = 0; i < topics.length; i++) {
            $("#topic")[0].sumo.add(topics[i].id_topic, topics[i].topic)
        }
    }

    $('select').on('change', function (e) {
        var values = []
        var optionSelected = $("option:selected", this);
        for (let i = 0; i < optionSelected.length; i++) {
            values[i] = optionSelected[i].value;
        }
        async function getProducts() {
            try {
                const response = await fetch("http://localhost:3333/profinal/filter", {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    body: JSON.stringify({ uses: [], topics: values })
                });
                const data = await response.json();

                //tabela product
                if (products != data) {

                    products = data
                    prod = []
                    for (let i = 0; i < products.length; i++) {
                        console.log(products[i].Product)
                        prod = prod + `<tr>
                    <th scope="row">`+ (i + 1) + `</th>
                    <td>`+ products[i].Product.product + `</td>
                    </tr>`
                    }
                    document.getElementById('combo_row').innerHTML = prod;
//
                }
                //fim tabela
            } catch (error) {
                console.log(error)
            }
        }
        getProducts();
    });

});