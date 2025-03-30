
const dataNascimentoInput = document.getElementById('data_nascimento');
const idadeInput = document.getElementById('idade');
const pesoInput = document.getElementById('peso');
const alturaInput = document.getElementById('altura');
const imcOutput = document.getElementById('imc');
const dataHoraAtend = document.getElementById('data_hora_atendimento');
const usarHoraAgora = document.getElementById('usar_hora_agora');
const anamneseForm = document.getElementById('anamnese')
const exportarButton = document.getElementById('exportar');

function calcularIdade(referencia, dataNascimento) {
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

    return {
        anos: idadeAnos,
        meses: idadeMeses,
        dias: idadeDias,
    };
}

function getDataHoraAtendimento() {
    return dataHoraAtend.valueAsDate;
}

function calcularTextoIdade() {
    const idade = calcularIdade(getDataHoraAtendimento(), dataNascimentoInput.value);

    if (isNaN(idade.anos)) return;
    idadeInput.value = `${idade.anos} anos, ${idade.meses} meses e ${idade.dias} dias`;
}

function calcularIMC() {
    const peso = parseFloat(pesoInput.value);
    const altura = parseFloat(alturaInput.value);

    if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
        const imc = peso / (altura * altura);
        imcOutput.innerText = imc.toFixed(2);
        // Adiciona cores com base nos valores de referência
        imcOutput.style.color = null;

        const idade = calcularIdade(dataNascimentoInput.value).anos
        if (idade >= 18 && idade < 60) {
            if (imc < 18.5) {
                imcOutput.style.color = 'blue'; // Abaixo do peso
            } else if (imc < 25) {
                imcOutput.style.color = 'green'; // Peso normal
            } else if (imc < 30) {
                imcOutput.style.color = 'orange'; // Sobrepeso
            } else {
                imcOutput.style.color = 'red'; // Obesidade
            }
        } else {
            // todo idoso
        }
    } else {
        imcOutput.innerText = '...';
    }
}

function calcularDados() {
    calcularTextoIdade()
    calcularIMC()
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

calcularDados();

dataNascimentoInput.addEventListener('input', calcularDados);
dataNascimentoInput.addEventListener('change', calcularDados);
pesoInput.addEventListener('input', calcularDados);
pesoInput.addEventListener('change', calcularDados);
alturaInput.addEventListener('input', calcularDados);
alturaInput.addEventListener('change', calcularDados);
dataHoraAtend.addEventListener('change', calcularDados);
usarHoraAgora.addEventListener('click', calculeHoraAgora);
exportarButton.addEventListener('click', abrirExportar);