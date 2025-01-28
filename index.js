import express from 'express';
import cors from 'cors';
import fs from 'fs'
hello
let autok = [];
let nextId = 0;

fs.readFile("autok.csv", "utf-8", (error, data) => {
    if(error) console.log(error)
    else {
        let sorok = data.split('\n');
        console.log(data);
        for(let sor of sorok){
            let s = sor.split(';');
            autok.push({ id:s[0]*1, tipus:s[1], suly:s[2]*1, loero:s[3]*1 })
        }
        for(let a of autok) if(a.id > nextId) nextId = a.id;
        nextId++;
        console.log('Beolvasott autók száma: ' + autok.length + '(nextId: ' + nextId + ')');
    }
})

const app = express();
app.use(express.json());
app.use(cors());

function addAuto(req, resp){
    if(req.body.tipus && req.body.suly && req.body.loero){
        const auto = { id:nextId++, tipus:req.body.tipus, suly:req.body.suly*1, loero:req.body.loero*1 }
        autok.push(auto)
        resp.send(auto)
    } else resp.send( { error: 'Hiányzó paraméterek!' } );
}

function modAuto(req, resp){
    if(req.body.id && req.body.tipus && req.body.suly && req.body.loero){
        let i = indexOf(req.body.id*1)
        if(i != -1){
            const auto = { id:nextId++, tipus:req.body.tipus, suly:req.body.suly*1, loero:req.body.loero*1 }
            autok[i] = auto
            resp.send(auto)
        } else resp.send( { error: "Hibás azonosító!" } )
    } else resp.send( { error: 'Hiányzó paraméterek!' } );
}

function indexOf(id){
    let i = 0; while( i<autok.length && autok[i].id != id ) i++;
    if( i<autok.length ) return i; else return -1;
}

function delAuto(req, resp){
    if(req.query.id){
        let i = indexOf(req.query.id*1);
        if(i != -1){
            const auto = autok.splice(i, 1);
            resp.send(auto[0]);
        } else resp.send( { error: "Hibás azonosító!" } )
    } else resp.send( { error: 'Hiányzó paraméter!' } );
}

app.get('/', (req, resp) => resp.send('<h1>Autó v1.0.0</h1>'));
app.get('/autok', (req, resp) => resp.send(autok));
app.post('/auto', addAuto);
app.put('/auto', modAuto);
app.delete('/auto', delAuto);

app.listen(88, (error) => {
    if(error) console.log(error); 
    else console.log('Server on :88')
})
