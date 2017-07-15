import { Injectable } from '@angular/core';
import {Apollo, ApolloQueryObservable} from 'apollo-angular';
import gql from 'graphql-tag';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Department} from "../models/department";

interface QueryResponseInterface{
  loading: boolean;
  data: any;
}

@Injectable()
export class GqlService {

  constructor(private apollo: Apollo) { }
  queryGQL(gqlString: any, variables?: any): Observable<any>{
    return this.apollo.watchQuery({
      query: gqlString,
      variables: variables});

  }


}
