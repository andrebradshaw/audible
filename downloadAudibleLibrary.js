function initAubibleLibraryMiner(){
    var reg = (o, n) => o ? o[n] : '';
    var cn = (o, s) => o ? o.getElementsByClassName(s) : null;
    var tn = (o, s) => o ? o.getElementsByTagName(s) : null;
    var gi = (o, s) => o ? o.getElementById(s) : null;
    var rando = (n) => Math.round(Math.random() * n);
    var delay = (ms) => new Promise(res => setTimeout(res, ms));
    var ele = (t) => document.createElement(t);
    var attr = (o, k, v) => o.setAttribute(k, v);
    const a = (l, r) => r.forEach(a => attr(l, a[0], a[1]));

    var ul_card_class = 'bc-list bc-list-nostyle';
    var title_class = 'bc-size-headline3';
    var narrator_class = 'narratorLabel';
    var author_class = 'authorLabel';
    var series_class = 'seriesLabel';

    var categories_class = 'bc-breadcrumb';
    var runtime_class = 'runtimeLabel';
    var release_date_class = 'releaseDateLabel';
    var publisher_class = 'publisherLabel';
    var summary = 'productPublisherSummary';
    var language = 'languageLabel';
    var cleanObject = (ob) => 
        Object.entries(ob).reduce((r, [k, v]) => {
        if(v != null && v != undefined && v !== "" && ( typeof v == 'boolean' || typeof v == 'string' || typeof v == 'symbol' || typeof v == 'number' || typeof v == 'function' || (typeof v == 'object'  && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true)) ) ) ) { 
            r[k] = v; 
            return r;
        } else { 
        return r; 
        }
        }, {});
    function convert2TsvAndDownload(records, named_file){
        const fileArray = records;
        const tsvReady = (s) => s ? s.replace(/\t|\u0009/g, ' ').replace(/\r|\n/g, '↵').replace(/"/g, "'") : s;
        const unqHsh = (a, o) => a.filter(i => o.hasOwnProperty(i) ? false : (o[i] = true));
        const unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
        const str = (o) => typeof o == 'object' ? tsvReady(JSON.stringify(o).replace(/\n|\r/g, ' ')) : o;
        var firstLevel = fileArray.map(el => Object.entries(el));
        var header = unqHsh(firstLevel.map(el => el.map(itm => itm[0])).flat(),{});
        var table = [header];
        for (var i = 0; i < firstLevel.length; i++) {
            var arr = [];
            var row = [];
            var record = firstLevel[i];
            for (var s = 0; s < record.length; s++) {
                var record_kv = record[s];
                var col_key = record_kv[0];      
                var place = header.indexOf(col_key);
                arr[place] = record_kv[1];
            }
            for (var a = 0; a < arr.length; a++) {
                if (arr[a]) {
                row.push(arr[a]);
                } else {
                row.push('');
                }
            }
            table.push(row);
        }
        function downloadr(arr2D, filename) {
            var data = /\.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el => el.reduce((a, b) => a + '\t' + b)).reduce((a, b) => a + '\r' + b);
            var type = /\.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
            var file = new Blob([data], {
                type: type
            });
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, filename);
            } else {
                var a = document.createElement('a'),
                url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                }, 10);
            }
        }
        var output_ = table.map(el => el.map(itm => str(itm)));
        downloadr(output_, named_file);
    }

    function parseURIasJSON(url,obj) {
        if(url.match(/(?<=\?|\&)\S+?(?=\&|$)/g)) url.match(/(?<=\?|\&)\S+?(?=\&|$)/g).map(r=> r ? r.split(/\=/) : [[]]).forEach(r=> obj[r[0]] = r[1])
        return obj;
    }



    const download_bar_width = document.body.getBoundingClientRect().width * 0.8;
    const all_cats = [{"category":"Architecture","type":"nonfiction"},{"category":"Art","type":"nonfiction"},{"category":"Arts & Entertainment"},{"category":"Audio Performances & Dramatizations"},{"category":"Entertainment & Performing Arts","type":"nonfiction"},{"category":"Music","type":"nonfiction"},{"category":"Photography","type":"nonfiction"},{"category":"Adventurers, Explorers & Survival","type":"nonfiction"},{"category":"Art & Literature","type":"nonfiction"},{"category":"Biographies & Memoirs"},{"category":"Cultural, Ethnic & Regional","type":"nonfiction"},{"category":"Diaries & Correspondence","type":"nonfiction"},{"category":"Entertainment & Celebrities","type":"nonfiction"},{"category":"Historical","type":"nonfiction"},{"category":"LGBT","type":"nonfiction"},{"category":"Military & War","type":"nonfiction"},{"category":"People with Disabilities","type":"nonfiction"},{"category":"Politics & Activism","type":"nonfiction"},{"category":"Professionals & Academics","type":"nonfiction"},{"category":"Religious","type":"nonfiction"},{"category":"Sports","type":"nonfiction"},{"category":"True Crime","type":"nonfiction"},{"category":"Women","type":"nonfiction"},{"category":"Business & Careers"},{"category":"Business Development & Entrepreneurship","type":"nonfiction"},{"category":"Career Success","type":"nonfiction"},{"category":"Management & Leadership","type":"nonfiction"},{"category":"Marketing & Sales","type":"nonfiction"},{"category":"Women in Business","type":"nonfiction"},{"category":"Workplace & Organizational Behavior","type":"nonfiction"},{"category":"Action & Adventure","type":"fiction"},{"category":"Animals & Nature","type":"fiction"},{"category":"Art","type":"fiction"},{"category":"Biographies","type":"nonfiction"},{"category":"Children's Audiobooks"},{"category":"Education & Learning","type":"nonfiction"},{"category":"Fairy Tales, Folk Tales & Myths","type":"fiction"},{"category":"History","type":"nonfiction"},{"category":"Holidays & Celebrations","type":"nonfiction"},{"category":"Literature & Fiction","type":"fiction"},{"category":"Music & Performing Arts","type":"fiction"},{"category":"Mystery & Suspense","type":"fiction"},{"category":"Religions"},{"category":"Science & Technology","type":"nonfiction"},{"category":"Science Fiction & Fantasy","type":"fiction"},{"category":"Vehicles & Transportation"},{"category":"Computer Science","type":"nonfiction"},{"category":"Computers & Technology"},{"category":"Content Creation & Social Media","type":"nonfiction"},{"category":"History & Culture","type":"nonfiction"},{"category":"Security & Encryption","type":"nonfiction"},{"category":"Education & Learning"},{"category":"Language Learning","type":"nonfiction"},{"category":"Study Guides & Test Preparation","type":"nonfiction"},{"category":"Words, Language & Grammar","type":"nonfiction"},{"category":"Writing & Publishing","type":"nonfiction"},{"category":"Erotica"},{"category":"Literature & Fiction","type":"fiction"},{"category":"Sex Instruction","type":"fiction"},{"category":"Addiction & Recovery","type":"nonfiction"},{"category":"Aging & Longevity","type":"nonfiction"},{"category":"Alternative & Complementary Medicine","type":"nonfiction"},{"category":"Beauty, Grooming & Style","type":"nonfiction"},{"category":"Children's Health","type":"nonfiction"},{"category":"Dentistry & Oral Health","type":"nonfiction"},{"category":"Fitness, Diet & Nutrition","type":"nonfiction"},{"category":"Health & Wellness"},{"category":"Medicine & Health Care Industry","type":"nonfiction"},{"category":"Psychology & Mental Health","type":"nonfiction"},{"category":"Safety & Emergency Preparedness","type":"nonfiction"},{"category":"Sexual & Reproductive Health","type":"nonfiction"},{"category":"Africa","type":"nonfiction"},{"category":"Americas","type":"nonfiction"},{"category":"Ancient History","type":"nonfiction"},{"category":"Arctic & Antarctica","type":"nonfiction"},{"category":"Asia","type":"nonfiction"},{"category":"Australia, New Zealand & Oceania","type":"nonfiction"},{"category":"Europe","type":"nonfiction"},{"category":"History"},{"category":"Middle East","type":"nonfiction"},{"category":"Military","type":"nonfiction"},{"category":"Religious","type":"nonfiction"},{"category":"Russia","type":"nonfiction"},{"category":"Women","type":"nonfiction"},{"category":"World","type":"nonfiction"},{"category":"Food & Wine","type":"nonfiction"},{"category":"Gardening & Horticulture","type":"nonfiction"},{"category":"Home & Garden"},{"category":"House & Home","type":"nonfiction"},{"category":"Pets & Animal Care","type":"nonfiction"},{"category":"Sustainable & Green Living","type":"nonfiction"},{"category":"Biographies & Memoirs","type":"nonfiction"},{"category":"LGBT"},{"category":"LGBT Studies","type":"nonfiction"},{"category":"Literature & Fiction","type":"fiction"},{"category":"Mystery, Thriller & Suspense","type":"fiction"},{"category":"Romance","type":"fiction"},{"category":"Science Fiction & Fantasy","type":"fiction"},{"category":"Action & Adventure","type":"fiction"},{"category":"African American","type":"fiction"},{"category":"Ancient, Classical & Medieval Literature","type":"fiction"},{"category":"Anthologies & Short Stories","type":"fiction"},{"category":"Classics","type":"fiction"},{"category":"Drama & Plays","type":"fiction"},{"category":"Erotica","type":"fiction"},{"category":"Essays","type":"fiction"},{"category":"Genre Fiction","type":"fiction"},{"category":"Historical Fiction","type":"fiction"},{"category":"Horror","type":"fiction"},{"category":"Humor & Satire","type":"fiction"},{"category":"LGBT","type":"fiction"},{"category":"Literary History & Criticism","type":"fiction"},{"category":"Literature & Fiction"},{"category":"Memoirs, Diaries & Correspondence","type":"fiction"},{"category":"Poetry","type":"fiction"},{"category":"Women's Fiction","type":"fiction"},{"category":"World Literature","type":"fiction"},{"category":"Banks & Banking","type":"nonfiction"},{"category":"Corporate & Public Finance","type":"nonfiction"},{"category":"E-Commerce","type":"nonfiction"},{"category":"Economics","type":"nonfiction"},{"category":"Insurance","type":"nonfiction"},{"category":"International","type":"nonfiction"},{"category":"Investing & Trading","type":"nonfiction"},{"category":"Money & Finance"},{"category":"Personal Finance","type":"nonfiction"},{"category":"Real Estate","type":"nonfiction"},{"category":"Crime Fiction","type":"fiction"},{"category":"Mystery","type":"fiction"},{"category":"Mystery, Thriller & Suspense"},{"category":"Thriller & Suspense","type":"fiction"},{"category":"True Crime","type":"nonfiction"},{"category":"Anthropology","type":"nonfiction"},{"category":"Archaeology","type":"nonfiction"},{"category":"Law","type":"nonfiction"},{"category":"Philosophy","type":"nonfiction"},{"category":"Politics & Government","type":"nonfiction"},{"category":"Politics & Social Sciences"},{"category":"Social Sciences","type":"nonfiction"},{"category":"Parenting & Families","type":"nonfiction"},{"category":"Personal Development","type":"nonfiction"},{"category":"Relationships","type":"nonfiction"},{"category":"Relationships, Parenting & Personal Development"},{"category":"Agnosticism","type":"nonfiction"},{"category":"Atheism","type":"nonfiction"},{"category":"Buddhism","type":"nonfiction"},{"category":"Christianity","type":"nonfiction"},{"category":"Hinduism","type":"nonfiction"},{"category":"Islam","type":"nonfiction"},{"category":"Judaism","type":"nonfiction"},{"category":"Occult","type":"nonfiction"},{"category":"Other Religions, Practices & Sacred Texts","type":"nonfiction"},{"category":"Religion & Spirituality"},{"category":"Religious Studies","type":"nonfiction"},{"category":"Spirituality","type":"nonfiction"},{"category":"Action & Adventure","type":"fiction"},{"category":"Anthologies & Short Stories","type":"fiction"},{"category":"Christian","type":"fiction"},{"category":"Clean & Wholesome","type":"fiction"},{"category":"Contemporary","type":"fiction"},{"category":"Fantasy","type":"fiction"},{"category":"Historical","type":"fiction"},{"category":"LGBT","type":"fiction"},{"category":"Military","type":"fiction"},{"category":"Multicultural","type":"fiction"},{"category":"Paranormal","type":"fiction"},{"category":"Romance"},{"category":"Romantic Comedy","type":"fiction"},{"category":"Romantic Suspense","type":"fiction"},{"category":"Royalty","type":"fiction"},{"category":"Science Fiction","type":"fiction"},{"category":"Sports","type":"fiction"},{"category":"Westerns","type":"fiction"},{"category":"Engineering","type":"nonfiction"},{"category":"Mathematics","type":"nonfiction"},{"category":"Science","type":"nonfiction"},{"category":"Science & Engineering"},{"category":"Fantasy","type":"nonfiction"},{"category":"Science Fiction","type":"nonfiction"},{"category":"Science Fiction & Fantasy","type":"nonfiction"},{"category":"Adventurers, Explorers & Survival","type":"nonfiction"},{"category":"Baseball & Softball","type":"nonfiction"},{"category":"Basketball","type":"nonfiction"},{"category":"Biographies & Memoirs","type":"nonfiction"},{"category":"Coaching","type":"nonfiction"},{"category":"Combat Sports & Self-Defense","type":"nonfiction"},{"category":"Cricket","type":"nonfiction"},{"category":"Cycling","type":"nonfiction"},{"category":"Equestrian Sports","type":"nonfiction"},{"category":"Extreme Sports","type":"nonfiction"},{"category":"Football","type":"nonfiction"},{"category":"Golf","type":"nonfiction"},{"category":"Hockey","type":"nonfiction"},{"category":"Motor Sports","type":"nonfiction"},{"category":"Olympics & Paralympics","type":"nonfiction"},{"category":"Outdoors & Nature","type":"nonfiction"},{"category":"Running & Jogging","type":"nonfiction"},{"category":"Soccer","type":"nonfiction"},{"category":"Sociology of Sports","type":"nonfiction"},{"category":"Sports & Outdoors"},{"category":"Sports History","type":"nonfiction"},{"category":"Sports Psychology","type":"nonfiction"},{"category":"Sports Writing","type":"nonfiction"},{"category":"Tennis","type":"nonfiction"},{"category":"Track & Field","type":"nonfiction"},{"category":"Triathlon","type":"nonfiction"},{"category":"Walking","type":"nonfiction"},{"category":"Water Sports","type":"nonfiction"},{"category":"Winter Sports","type":"nonfiction"},{"category":"Biographies","type":"nonfiction"},{"category":"Health, Lifestyle & Relationships","type":"nonfiction"},{"category":"History & Culture","type":"nonfiction"},{"category":"Literature & Fiction","type":"fiction"},{"category":"Mystery, Thriller & Suspense","type":"fiction"},{"category":"Politics, Society & Current Events","type":"nonfiction"},{"category":"Religion & Spirituality","type":"nonfiction"},{"category":"Romance","type":"fiction"},{"category":"Science & Technology","type":"nonfiction"},{"category":"Science Fiction & Fantasy","type":"fiction"},{"category":"Teen & Young Adult"},{"category":"Adventure Travel","type":"nonfiction"},{"category":"Africa","type":"nonfiction"},{"category":"Asia","type":"nonfiction"},{"category":"Australia & Oceania","type":"nonfiction"},{"category":"Caribbean","type":"nonfiction"},{"category":"Central & South America","type":"nonfiction"},{"category":"Europe","type":"nonfiction"},{"category":"Guided Tours","type":"nonfiction"},{"category":"Middle East","type":"nonfiction"},{"category":"North America","type":"nonfiction"},{"category":"Polar Regions","type":"nonfiction"},{"category":"Russia","type":"nonfiction"},{"category":"Travel & Tourism"},{"category":"Travel Writing & Commentary","type":"nonfiction"}];
    const getCatType = (subcat) => all_cats.filter(r=> r.category === subcat).length && all_cats.filter(r=> r.category === subcat)[0].type;

    async function fetchDoc(url){
        const res = await fetch(url);
        const text = await res.text();
        return new DOMParser().parseFromString(text,'text/html');
    }

    async function getBookDetails(url){
        if(url){
            try{
                const doc = await fetchDoc(url);
                return parseBookDetails(doc);
            }
            catch(err){
                console.log('failed');
                console.log(err);
                return {};
            }
        }else{
            return {};
        }
    }
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

    function parseBookDetails(doc){
        const categories = cn(doc,categories_class)[0] && Array.from(tn(cn(doc,categories_class)[0],'a')).length ? Array.from(tn(cn(doc,categories_class)[0],'a')).map(a=> a.innerText.trim()) : [];
        const date = cn(doc,release_date_class)[0] ? dateString(cn(doc,release_date_class)[0].innerText.replace(/.+date:/i,'').trim()) : '';
        let extra_cats = Array.from(cn(doc,'bc-chip-text'))?.map(i=> i.getAttribute('data-text'));
        return cleanObject({
            main_category: categories[0],
            sub_category: categories[categories.length-1],
            categories: [...categories,...extra_cats],
            duration_minutes: cn(doc,runtime_class)[0] ? lengthOfBookInMinutes(cn(doc,runtime_class)[0].innerText.replace(/length:/i,'').trim()) : '',
            language: cn(doc,language)?.[0]?.innerText?.replace(/[\s\n\r]*language:[\s\n\r]+/gi,'')?.trim(),
            release_date: date,
            release_timestamp: date ? new Date(date).getTime() : '',
            publisher: cn(doc,publisher_class)[0] ? cn(doc,publisher_class)[0].innerText.replace(/Publisher:/i,'').trim() : '', 
            category_type: getCatType(categories[categories.length-1]),
            publisher_summary: cn(doc,summary)[0]?.innerText?.trim()?.replace(/Publisher's Summary\s*/,'')?.replace(/([\n\r\s]+|)©.+/,'')?.replace(/[\n\r]+(\s+|)/g,'<br>')?.replace(/\t/g,' ')?.replace(/"/g,"'"),
            book: /, book (\d+)/i.exec(cn(doc,series_class)?.[0]?.innerText)?.[1],
            rating: tryFloat(/[\d\.]+/.exec(cn(cn(doc,'ratingsLabel')?.[0],'bc-pub-offscreen')?.[0]?.innerText)?.[0]),
            num_ratings: tryFloat(/[\d,]+/.exec(cn(cn(doc,'ratingsLabel')?.[0],'bc-color-link')?.[0]?.innerText)?.[0]?.replace(/\D+/)),
            critic_summary: cn(doc,'productCriticsSummary')?.[0]?.innerText?.trim()?.replace(/Critic Reviews\s*/,'')?.replace(/([\n\r\s]+|)©.+/,'')?.replace(/[\n\r]+(\s+|)/g,'<br>')?.replace(/\t/g,' ')?.replace(/"/g,"'"),
        })
    }
    function tryFloat(d){ try{ return parseFloat(d) } catch(err) {return d }}

    async function getAudibleLibraryPage(page){
        const doc = await fetchDoc(`https://www.audible.com/library/titles?ref=a_library_t_c6_pageNum_${page}&pageSize=50&page=${page+1}`);
        return parseLibraryPage(doc);
    }
    
    function parseLibraryPage(doc){
        return cn(doc,'adbl-library-content-row').length ? Array.from(cn(doc,'adbl-library-content-row')).map(card=> {
            let ul = cn(card,ul_card_class)[0];
            let author = cn(ul,author_class)[0];
            let narrator = cn(ul,narrator_class)[0];
            let series = cn(ul, series_class)[0];
            return {
            url: cn(ul,title_class)[0] && cn(ul,title_class)[0].parentElement ? cn(ul,title_class)[0].parentElement.href?.replace(/\?.+/,'') : '',
            title: cn(ul,title_class)[0] ? cn(ul,title_class)[0].innerText.trim() : '',
            author: author && cn(author,'bc-size-callout')[0] ? cn(author,'bc-size-callout')[0].innerText.trim() : '',
            narrator: narrator && cn(narrator,'bc-size-callout')[0] ? cn(narrator,'bc-size-callout')[0].innerText.trim() : '',
            series: series && tn(series,'a')[0] ? tn(series,'a')[0].innerText.trim() : '',
            }
        }) : [];
    }

    async function loopThroughtAudibleLibrary(){
        gi(document, 'downloading_percentage_txt').innerText = 'Retrieving titles...';
        const doc = await fetchDoc(`https://www.audible.com/library/titles?ref=a_library_t_c6_pageNum_0&pageSize=50&page=1`)
        const page_size = parseInt(Array.from(doc.getElementsByName('pageSize')[0].getElementsByTagName('option')).filter(r=> r && r.selected)[0].value);
        const num_pages = Math.max(...Array.from(doc.getElementsByClassName('pageNumberElement')).map(p=> p.innerText.trim()).filter(r=> r && /^\d+$/.test(r)).map(n=> parseInt(n)));
        const num_titles = (page_size*num_pages);
        const total_results = Math.ceil(num_titles/50);
        const contain_arr = [];
        for(let i=0; i<total_results; i++){
        const cards = await getAudibleLibraryPage(i);
        await delay(111);
        if(cards){
            cards.forEach(card=> {
            if( contain_arr.every(itm=> itm.url != card.url) ) contain_arr.push(card)
            });
            if(cards.some(card=> card.title == 'Your First Listen')) break;
        }
        gi(document, 'downloading_percentage_bar').style.width = `${(download_bar_width * (i / total_results))}px`;
        gi(document, 'downloading_percentage_bar').style.background = i % 2 == 0 ? '#07ba5b' : '#3de367';
        gi(document, 'downloading_percentage_txt').innerText = `${Math.ceil((i / total_results) * 100)}% complete`;
        }
        return contain_arr;
    }

    async function enrichLibraryInformation(){
        createDownloadHTML();
        var library = await loopThroughtAudibleLibrary();
        var contain_arr = [];
        gi(document, 'downloading_percentage_txt').innerText = 'Retrieving addtional information on titles...';
        const total_results = library.length;
        for(let i=0; i<total_results; i++){
            let details = await getBookDetails(library[i].url);
            let merge = cleanObject({...library[i],...details});
            contain_arr.push(merge);
            if(i == 2) console.log(contain_arr);
            await delay(rando(1111)+1111);
            gi(document, 'downloading_percentage_bar').style.width = `${(download_bar_width * (i / total_results))}px`;
            gi(document, 'downloading_percentage_bar').style.background = i % 2 == 0 ? '#07ba5b' : '#3de367';
            gi(document, 'downloading_percentage_txt').innerText = `${Math.ceil((i / total_results) * 100)}% complete -- approx ${Math.round(((((total_results-i)/100)*1.9)/60)*100)} minutes remaining`;
        }
        gi(document, 'downloading_percentage_bar').style.width = `${download_bar_width}px`;
        gi(document, 'downloading_percentage_txt').innerText = `100% complete`
        console.log(contain_arr);
        convert2TsvAndDownload(contain_arr,'audible_export_' + new Date().getTime() + '.tsv');
        if (gi(document, 'downloading_notifier')) gi(document, 'downloading_notifier').outerHTML = '';
    }

    function createDownloadHTML() {
        if(gi(document,'downloading_notifier')) gi(document,'downloading_notifier').outerHTML = '';
        const body_width = document.body.getBoundingClientRect().width;
        let cont = ele('div');
        a(cont, [['id', 'downloading_notifier'], ['style', `position: fixed; top: 100px; left: ${((body_width - download_bar_width)/2)}px; width: ${download_bar_width}px; z-index: ${new Date().getTime()}; background: #121212; border: 1px solid #3de367; border-radius: 0.2em;`]]);
        document.body.appendChild(cont);
        let perc = ele('div');
        a(perc, [['id', 'downloading_percentage_bar'], ['style', `width: 0px; height: 50px; background: #3de367; border: 1px solid #3de367; border-bottom-right-radius: 0.2em; border-top-right-radius: 0.2em; transition: all 1s;`]]);
        cont.appendChild(perc);
        let txt = ele('div');
        a(txt, [['id', 'downloading_percentage_txt'], ['style', `float: left; padding: 14px; color: #fff; width: 430px;`]]);
        perc.appendChild(txt);
        txt.innerText = 'initiating download...';
    }

    enrichLibraryInformation()
}
initAubibleLibraryMiner()
