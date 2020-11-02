var products = []
var prod = []
var topics = []
var uses = []
$(document).ready(function () {

    
    async function getProducts() {
        try {
            const response = await fetch("http://localhost:3333/profinal", {
                method: 'get'
            });
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                prod = prod+  `<tr>
                <th scope="row">`+ (i + 1) + `</th>
                <td>`+ data[i].Product.product + `</td>
                </tr>`
            }
            document.getElementById('combo_row').innerHTML = prod;
        } catch(error) {
            console.log(error)
        }
    }
    getProducts();

    async function getTopics() {
        try {
            const response = await fetch("http://localhost:3333/topics", {
                method: 'get'
            });
            const data = await response.json();
            console.log(data);
            showAllTopics(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getUses() {
        try {
            const response = await fetch("http://localhost:3333/uses", {
                method: 'get'
            });
            const data = await response.json();
            console.log(data);
            showAllUses(data);
        } catch (error) {
            console.log(error);
        }
    }
    getTopics();
    getUses();
    $('#uses').SumoSelect();
    $('#topic').SumoSelect();


    function showAllTopics(topics) {

        for (let i = 0; i < topics.length; i++) {
            $("#topic")[0].sumo.add(topics[i].id_topic, topics[i].topic)
        }
    }
    function showAllUses(uses) {
        for (let i = 0; i < uses.length; i++) {
            $("#uses")[0].sumo.add(uses[i].id_use, uses[i].use)
        }
    }
    async function getProducts() {
        try {
            const response = await fetch("http://localhost:3333/profinal/filter", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({ uses: uses, topics: topics })
            });
            const data = await response.json();

            //tabela product
            if (products != data) {

                products = data
                prod = []
                console.log(uses);
                console.log(topics);
                for (let i = 0; i < products.length; i++) {
                    console.log(products[i].Product)
                    prod = prod+  `<tr>
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
    async function topicsByUses() {
        try {
            const response = await fetch("http://localhost:3333/profinal", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({uses: uses})
            })
            const data = await response.json();
            const length = $("#topic > option").length
            
            for (let i = length; i>=1; i--) {
                $("#topic")[0].sumo.remove(i-1);
            }
            for (let i = 0; i < data.length; i++) {
                $("#topic")[0].sumo.add(data[i].Topic.id_topic, data[i].Topic.topic)
            }
        }catch(error) {
            console.log(error);
        }
    }

    $('#uses').on('change', function(e) {
        uses = []
        var optionSelected = $("option:selected", this);
        for (let i = 0; i < optionSelected.length; i++) {
            uses[i] = optionSelected[i].value;
        }
        topicsByUses();
        getProducts();
    });

    $('#topic').on('change', function (e) {
        topics = []
        var optionSelected = $("option:selected", this);
        for (let i = 0; i < optionSelected.length; i++) {
            topics[i] = optionSelected[i].value;
        }
        getProducts();
    });

});