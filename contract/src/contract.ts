import { NearBindgen, near, call, view, LookupMap, initialize, assert } from 'near-sdk-js';

// when we mint a token we use this class 
class Token{
  token_id: any;
  owner_id: string; 

  constructor(token_id: any, owner_id: string){

    this.token_id = token_id;
    this.owner_id = owner_id; // used for tracking 

  }
}

@NearBindgen({})
class TravlrNFT {
  
  owner_id: string;
  owner_by_id: LookupMap;

  constructor(){ 
    this.owner_id ="";
    this.owner_by_id = new LookupMap("o");
  }
  
  @initialize({})
  init({owner_by_id_prefix, owner_id}){

    this.owner_by_id = new LookupMap(owner_by_id_prefix);
    this.owner_id =  owner_id;

  }
  
  @call({})
  mint({token_id, token_owner_id}){

    assert(near.predecessorAccountId() == this.owner_id, "Unauthorized transaction");  // checks to make sure its a valid transaction

    assert (this.owner_by_id.get(token_id) === null, "Token Id must be unique");

    this.owner_by_id.set(token_id, token_owner_id); //allows us to put a new entry into the map

    return new Token(token_id, token_owner_id);

  }

  @view({})
  get_token_by_id({token_id}){

    let owner_of_token = this.owner_by_id.get(token_id);

    if (owner_of_token == null ) {
      return null; 
    }

    return new Token (token_id, owner_of_token.toString());
  }

}