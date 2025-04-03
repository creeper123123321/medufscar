function generateIsda() {
    const sintomasIsda = {
        nega_febre: "Nega febre",
        nega_astenia: "Nega astenia",
        nega_alteracao_peso: "Nega alteração de peso",
        nega_sudorese: "Nega sudorese",
        nega_calafrios: "Nega calafrios",
        nega_caibras: "Nega cãibras",
    };

    const generated_isda_fields = document.getElementById("generated_isda_fields");

    for (const id in sintomasIsda) {
        const nome = sintomasIsda[id];
        const divFormGroup = document.createElement("div");
        divFormGroup.className = "form-check"

        const input = document.createElement("input");
        input.className = "form-check-input";
        input.setAttribute("type", "checkbox");
        input.setAttribute("id", `isda_${id}`);
        input.setAttribute("name", `isda_${id}`);

        const label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", `isda_${id}`);
        label.textContent = nome;

        divFormGroup.appendChild(input);
        divFormGroup.appendChild(label);
        generated_isda_fields.appendChild(divFormGroup);
    }
}

function calculateAge(referencia, dataNascimento) {
    const dataNascimentoObj = new Date(dataNascimento);
    const hoje = new Date(referencia)

    let idadeAnos = hoje.getFullYear() - dataNascimentoObj.getFullYear();
    let idadeMeses = hoje.getMonth() - dataNascimentoObj.getMonth();
    let idadeDias = hoje.getDate() - dataNascimentoObj.getDate();

    if (idadeMeses < 0 || (idadeMeses === 0 && idadeDias < 0)) {
        idadeAnos--;
        idadeMeses += 12;
    }

    if (idadeDias < 0) {
        const ultimoDiaDoMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
        idadeDias += ultimoDiaDoMesAnterior;
        idadeMeses--;
    }

    return { anos: idadeAnos, meses: idadeMeses, dias: idadeDias };
}

$(function () {
    generateIsda();

    const dataNascimentoInput = document.getElementById('data_nascimento');
    const idadeInput = document.getElementById('idade');
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    const imcOutput = document.getElementById('imc');
    const dataHoraAtend = document.getElementById('data_hora_atendimento');
    const usarHoraAgora = document.getElementById('usar_hora_agora');
    const anamneseForm = document.getElementById('anamnese')
    const exportarButton = document.getElementById('exportar');


    function getDataHoraAtendimento() {
        return dataHoraAtend.valueAsDate;
    }

    function generateAgeText() {
        const idade = calculateAge(getDataHoraAtendimento(), dataNascimentoInput.value);

        if (isNaN(idade.anos)) return;
        idadeInput.value = `${idade.anos} anos, ${idade.meses} meses e ${idade.dias} dias`;
    }

    function generateBmiValue() {
        const peso = parseFloat(pesoInput.value);
        const altura = parseFloat(alturaInput.value);

        if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
            const imc = peso / (altura * altura);
            let textoFinal = imc.toFixed(2);
            imcOutput.style.color = null;

            const idade = calculateAge(getDataHoraAtendimento(), dataNascimentoInput.value).anos
            if (idade >= 18 && idade < 60) {
                if (imc < 18.5) { // Abaixo do peso
                    imcOutput.style.color = 'blue';
                    textoFinal += " (abaixo)";
                } else if (imc < 25) { // Peso normal
                    imcOutput.style.color = 'green';
                    textoFinal += " (normal)"
                } else if (imc < 30) { // Sobrepeso
                    imcOutput.style.color = 'orange';
                    textoFinal += " (sobrepeso)"
                } else { // Obesidade
                    imcOutput.style.color = 'red';
                    textoFinal += " (obesidade)"
                }
            } else {
                // todo idoso
            }

            imcOutput.innerText = textoFinal;
        } else {
            imcOutput.innerText = '...';
        }
    }

    function recalculateGeneratedData() {
        generateAgeText()
        generateBmiValue()
    }

    function calculeHoraAgora() {
        const dateNow = new Date();
        dateNow.setMinutes(dateNow.getMinutes() - dateNow.getTimezoneOffset());
        dataHoraAtend.value = dateNow.toISOString().substring(0, 16);
    }

    function abrirExportar() {
        const obj = {}
        new FormData(anamneseForm).forEach((value, key) => {
            obj[key] = value;
        });
        const json = JSON.stringify(obj);

        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        window.open(url);
    }

    recalculateGeneratedData();

    dataNascimentoInput.addEventListener('input', recalculateGeneratedData);
    dataNascimentoInput.addEventListener('change', recalculateGeneratedData);
    pesoInput.addEventListener('input', recalculateGeneratedData);
    pesoInput.addEventListener('change', recalculateGeneratedData);
    alturaInput.addEventListener('input', recalculateGeneratedData);
    alturaInput.addEventListener('change', recalculateGeneratedData);
    dataHoraAtend.addEventListener('change', recalculateGeneratedData);
    usarHoraAgora.addEventListener('click', calculeHoraAgora);
    exportarButton.addEventListener('click', abrirExportar);
});