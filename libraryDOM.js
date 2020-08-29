var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : null;
var tn = (o, s) => o ? o.getElementsByTagName(s) : null;
var gi = (o, s) => o ? o.getElementById(s) : null;
var rando = (n) => Math.round(Math.random() * n);
var delay = (ms) => new Promise(res => setTimeout(res, ms));

function parseURIasJSON(url,obj) {
  if(url.match(/(?<=\?|\&)\S+?(?=\&|$)/g)) url.match(/(?<=\?|\&)\S+?(?=\&|$)/g).map(r=> r ? r.split(/\=/) : [[]]).forEach(r=> obj[r[0]] = r[1])
  return obj;
}

var ul_card_class = 'bc-list bc-list-nostyle';
var title_class = 'bc-size-headline3';
var narrator_class = 'narratorLabel';
var author_class = 'authorLabel';
var series_class = 'seriesLabel';

var categories_class = 'bc-breadcrumb';
var runtime_class = 'runtimeLabel';
var	release_date_class = 'releaseDateLabel';
var publisher_class = 'publisherLabel';

function lengthOfBookInMinutes(s){
  var mins = reg(/\d+(?=\smin)/.exec(s),0) ? parseInt(reg(/\d+(?=\smin)/.exec(s),0)) : 0;
  var hours =  reg(/\d+(?=\shrs)/.exec(s),0) ? (parseInt(reg(/\d+(?=\shrs)/.exec(s),0)) * 60) : 0;
  return hours + mins;
}

function dateString(d){
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var date = new Date(d);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

async function getBookDetails(url){
  if(url){
    try{
      const res = await fetch(url);
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text,'text/html');
      return parseBookDetails(doc);
    }
    catch(err){
      console.log(err);
      return {};
    }
  }else{return {};}
}

function parseBookDetails(doc){
  var categories = cn(doc,categories_class)[0] && Array.from(tn(cn(doc,categories_class)[0],'a')).length ? Array.from(tn(cn(doc,categories_class)[0],'a')).map(a=> a.innerText.trim()) : [];
  return {
    category: categories[categories.length-1],
    categories: categories,
    runtime: cn(doc,runtime_class)[0] ? lengthOfBookInMinutes(cn(doc,runtime_class)[0].innerText.replace(/length:/i,'').trim()) : '',
    release_date: cn(doc,release_date_class)[0] ? dateString(cn(doc,release_date_class)[0].innerText.replace(/.+date:/i,'').trim()) : '',
    publisher: cn(doc,publisher_class)[0] ? cn(doc,publisher_class)[0].innerText.replace(/Publisher:/i,'').trim() : '', 
  }
}

async function getAudibleLibraryPage(page){
  const res = await fetch(`https://www.audible.com/library/titles?ref=a_library_t_c6_pageNum_${page}&pageSize=50&page=${page+1}`);
  const text = await res.text();
  const doc = new DOMParser().parseFromString(text,'text/html');
  return parseLibraryPage(doc);
}

function parseLibraryPage(doc){
  return cn(doc,'adbl-library-content-row').length ? Array.from(cn(doc,'adbl-library-content-row')).map(card=> {
    let ul = cn(card,ul_card_class)[0];
    let author = cn(ul,author_class)[0];
    let narrator = cn(ul,narrator_class)[0];
    let series = cn(ul, series_class)[0];
    return {
      title: cn(ul,title_class)[0] ? cn(ul,title_class)[0].innerText.trim() : '',
      url: cn(ul,title_class)[0] && cn(ul,title_class)[0].parentElement ? cn(ul,title_class)[0].parentElement.href.replace(/\?.+/,'') : '',
      author: author && cn(author,'bc-size-callout')[0] ? cn(author,'bc-size-callout')[0].innerText.trim() : '',
      narrator: narrator && cn(narrator,'bc-size-callout')[0] ? cn(narrator,'bc-size-callout')[0].innerText.trim() : '',
      series: series && tn(series,'a')[0] ? tn(series,'a')[0].innerText.trim() : '',
    }
  }) : [];
}


async function loopThroughtAudibleLibrary(){
  var contain_arr = [];
  for(let i=0; i<1; i++){
    const cards = await getAudibleLibraryPage(i);
    await delay(111);
    if(cards){
      cards.forEach(card=> {
        if( contain_arr.every(itm=> itm.title != card.title) ) contain_arr.push(card)
      });
    }
  }
  return contain_arr;
}

async function enrichLibraryInformation(){
  var library = await loopThroughtAudibleLibrary()
  var contain_arr = [];
  for(let i=0; i<library.length; i++){
    var details = await getBookDetails(library[i].url);
    var merge = {...library[i],...details};
    contain_arr.push(merge);
    if(i == 2) console.log(contain_arr);
    await delay(rando(1111)+1111);
  }
  console.log(contain_arr);
}

enrichLibraryInformation()
