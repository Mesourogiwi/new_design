
var url = "https://nutraceuticals.herokuapp.com"
var products = []
var prod = []
var topics = []
var uses = []
var allergy = ['Milk', 'Peanut', 'Eggs', 'Fish', 'Walnuts']
var selectedAllergies = []
var selectedDiets = 0
var diet = ['vegan']
var numTopic = 0
var numUses = 0
$(document).ready(function () {
    getProducts();

    async function getTopics() {
        try {
            const response = await fetch(`${url}/topics`, {
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
            const response = await fetch(`${url}/uses`, {
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
    $('#allergy').SumoSelect();
    $('#diet').SumoSelect();


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

    function showAllAllergies(allergy) {
        for (let i = 0; i < allergy.length; i++) {
            $("#allergy")[0].sumo.add(allergy[i])
        }
    }

    function showAllDiets(diet) {

        for (let i = 0; i < diet.length; i++) {
            $("#diet")[0].sumo.add(diet[i])
        }
    }


    showAllAllergies(allergy)
    showAllDiets(diet)

    async function getProducts() {
        try {
            const response = await fetch(`${url}/profinal/filter`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify({ uses: uses, topics: topics,vegan: selectedDiets, allergies: selectedAllergies})
            });
            console.log(selectedAllergies);
            console.log(selectedDiets);
            const data = await response.json();
            console.log(data);

            if(numTopic < topics.length){
                numTopic ++
            }
            if(numTopic > topics.length){
                numTopic --
            }
            if(numUses < uses.length){
                numUses ++
            }
            if(numUses > uses.length){
                numUses --
            }

            //tabela product
            if (products != data) {

                products = data
                prod = []
                console.log(numTopic)
                console.log(numUses)
                for (let i = 0; i < products.length; i++) {
                    prod = prod+  `<tr>
                    <th scope="row">`+ (i + 1) + `</th>
                    <td>`+ products[i].Product.product + `</td>
                    <td> ${data[i].Use.use} </td>
                    <td> ${data[i].Topic.topic} </td>
                    <td> ${data[i].suggestion} </td>
                    <td> ${data[i].evidence} </td>
                    <td> ${data[i].efficiency} </td>
                    <td> ${data[i].consistency} </td>
                    </tr>`
                }
                document.getElementById('combo_row').innerHTML = prod;
                $("#prod_count").html(`Product ${data.length}`);
                if(numTopic === 0) {
                    $("#topic_count").html("Topic " + $("#topic > option").length);
                }
                else{
                    $("#topic_count").html(`Topic ${numTopic}`);
                }
                if(numUses === 0) {
                    $("#use_count").html("Use " + $("#uses > option").length);
                }
                else{
                    $("#use_count").html(`Use ${numUses}`);
                }
//
            }
            //fim tabela
        } catch (error) {
            console.log(error)
        }
    }
    async function topicsByUses() {
        try {
            const response = await fetch(`${url}/profinal`, {
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

    $('#allergy').on('change', function (e) {
        selectedAllergies = []
        var optionSelected = $("option:selected", this);
        for (let i = 0; i < optionSelected.length; i++) {
            selectedAllergies[i] = optionSelected[i].label;
        }
        getProducts();
    });
    $('#diet').on('change', function (e) {
        if(selectedDiets) {
            selectedDiets = 0
        }
        else {
            selectedDiets = 1
        }
        getProducts();
    });

});