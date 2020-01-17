export class ItemResponse {
    constructor(public item: Item) {

    }
}

export class Item {
    constructor(      
        public icon:        string,
        public icon_large:  string,
        public id:          number,
        public type:        string,
        public typeIcon:    string,
        public name:        string,
        public description: string,
        public current:     Current,
        public today:       Today,
        public members:     string,
        public day30:       Day,
        public day90:       Day,
        public day180:      Day) {
  
    }
}

export class Current {
    constructor(  
        public trend: string,
        public price: string) {

    }

}

export class Day {
    constructor(  
        public trend:  string,
        public change: string) {

    }
   
}

export class Today {
    constructor(  
        public trend: string,
        public price: number) {

    }
 
}
