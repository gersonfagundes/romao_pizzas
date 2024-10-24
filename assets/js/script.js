let cart = [];
let modalQt = 1;
let modalKey = 0;

//Macete para n ter que ficar digitando sempre document.querySelector ja qua vamos utilizar muito
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//O método map() em JavaScript é usado para iterar sobre arrays e criar um novo array, aplicando uma função a cada elemento do array original sem alterar o original
//Map() pode receber 3 parametros, o primeiro é o elemento do array, nesse caso temos vários, o segundo é o indice do elemento(0,1,2...) e o terceiro é o array original completo, por padrão ele SEMPRE recebe nessa ordem, o nome do parametro abaixo eu posso mudar, mas o valor que ele irá pegar são esses SEMPRE.
//LISTAGENS DAS PIZZAS
pizzaJson.map((item, index) => {
//clodeNode(true) clona o elemento, o true é necessário para clonar o conteudo interno dele tbm
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);//adiciona um atributo com o valor sendo a chave/posição de cada uma das pizzas[0,1,2...]
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

//EVENTOS DE CLICK PARA ABRIR O MODAL
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();//previne o comportamento padrao do botão que é atualizar a tela pois n queremos atualizar e sim fazer aparecer uma outra aba por cima ao clicar.(todo botão atualiza a tela por padrão).

        let key = e.target.closest('.pizza-item').getAttribute('data-key');//aqui estamos no elemento A, com o target iriamos pegar ele, com o target.closest vamos pegar o elemento mais próximo dele e que tenha a classe "pizza-item" e pegamos o atributo data-key dele
//Consegui usar item.name porque o JavaScript mantém o valor de item acessível no escopo do clique. Funciona, mas usar key para acessar pizzaJson[key].name é mais seguro e garante que você sempre está pegando a pizza certa, mesmo se o código crescer ou ficar mais complexo.
        modalQt = 1;//toda vez que o user abrir uma nova pizza do MODAl, o valor de modalQt vai ser 1, pois imagine se ele tivesse selecionado 2 quantidades e fechou a janela, aquelas duas quantidades iriam ficar salvas para a próxima janela, dessa forma deixamos como padrão sempre 1 ao abrir.
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');//remove a classe selected para abaixo no IF deixar o selected por padrão só nas pizzas grandes ao clicar na pizza
//o forEach automaticamente recebe dois parâmetros:
//size: O elemento atual do NodeList que está sendo iterado.
//sizeIndex: O índice daquele elemento, começando em 0. Esse nomes podemos mudar, mas ele é como o MAP, sempre recebe esses 2 parametros, menos o array original no final que só o map recebe.      
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{   
            if(sizeIndex == 2){
                size.classList.add('selected');//deixando ele só nas pizzas grandes[0,1,2] toda vez que abrir novamente outras ele ficara na grande até o usuário mudar caso queira
            }      
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt; //aqui no modal, o valor de modalQt vai ser o valor que o user selecionou na janela, mas se for pra outra janela ele vai ser 1 como padrão.

        c('.pizzaWindowArea').style.opacity = 0;//assim ao clicar ele oculta a janela, opacidade vai de 0 a 1.
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);//após 200ms ele volta a aparecer, isso junto com o transform: all ease .5s; do CSS faz a nova aba aparecer animadamente, e mais suave.
    });

    c('.pizza-area').append(pizzaItem);//append para adicionar um após o outro, se fosse innerHtml ele iri substituir o conteudo a cada chamada
});

//EVENTOS DO MODAL

function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;//deixa ele sem poder ser visto
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';//tira ele da tela possibilitando clicar novamente, se fosse só o opacity ele iria sumir mas n conseguiriamos clicar em outra pizza, pois ele estaria apenas transparente.
    }, 200);
}
//Se usarmos c() (que utiliza querySelector), ele só considera o primeiro elemento encontrado, ou seja a primeira de uma dessas classes que ele encontrar apenas. Por outro lado, cs() (que utiliza querySelectorAll) seleciona todos os elementos correspondentes, permitindo que você adicione eventos a cada um deles, ou seja as duas (ou mais) classes indicadas.
//Fora que O forEach não pode ser usado com c() porque c() retorna apenas um único elemento. O forEach é um método de array que funciona em listas de elementos, como a NodeList retornada por cs().
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);//ao clicar em alguma dessas classes executa o closeModal
});
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){//apenas se a qtd for maior que 1
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//Ele deixa apenas 1 dos tamanhos selecionados, se clicar em outro o anterior fica sem seleção
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{   
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
//Criando um identificador para os cenários que o usuário adicione a pizza e depois querer adicionar mais quantidades da mesma pizza do mesmo tamanho, para no array n criar dois registros da mesma pizza juntamos o ID e o tamanho, os dois sendo iguais vamos adicionar apenas a quantidade nesse registro já existente. 
//o retorno de FindIndex é caso achar alguma pizza com o mesmo ID e tamanho, se n encontrar vai retornar -1, ele faz uma varredura no array e retorna isso no parametro que é uma função q criamos
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);//verifica n substitui
    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size, //ele entende quando o nome da chave é igual do nome do valor, mesmo sendo uma variavel
            qt:modalQt
        });
    }

    updateCart();
    closeModal();
});

//para o carrinho no mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

//Find no JavaScript é usado em arrays para retornar o primeiro elemento que satisfaz uma função de teste fornecida, O item no contexto da função find é o elemento atual do array que está sendo iterado. O método find() percorre cada elemento do array em busca de um que satisfaça a condição fornecida. O nome item pode ser qualquer coisa, mas é apenas um nome para o parâmetro que representa cada elemento do array à medida que ele é processado.
function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;//para o mobile

    if(cart.length > 0){//caso eu tenha itens no carrinho
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){ 
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);//pegando o ID em pizzaJason que seja igual ao ID de cart

            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
//splice() é usado para adicionar, remover ou substituir elementos em um array. Ele modifica o array original e retorna os elementos removidos. A sintaxe básica é:
//array.splice(start, deleteCount)
//start: Índice inicial onde as mudanças ocorrerão no array.
//deleteCount: Número de elementos a serem removidos. Se for 0, nenhum elemento será removido.
                    cart.splice(i, 1);
                }
                updateCart();//se responsabiliza em fechar o carrinho
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;//aproveitando que estamos dentro do FOR
                updateCart();
            });


            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;//10% de desconto
        total = subtotal - desconto;
//span:last-child: seleciona o último elemento de um grupo de elementos pois dentro temos 2 spans e eles não tem identificação, e queremos apenas o ultimo.
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');//para q após adicionar o item, e depois remover novamente o item a classe suma, e não fique aparecendo mais o carrinho mesmo estando vazio.
        c('aside').style.left = '100vw';
    }
}