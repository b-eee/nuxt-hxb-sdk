import { HexabaseClient } from "@hexabase/hexabase-js";
import {defineStore} from "pinia";
// const url = "https://graphql.hexabase.com/graphql";

export const useHexabaseClient = defineStore("hexabase",  {
    state: () => {
        // Token name for localStorage
        const tokenName = "hexabaseToken";
        // Get token from localStorage
        const token = localStorage.getItem(tokenName);
        // GraphQL endpoint
        const baseUrl = process.env.URL
        const hexabase: any = new HexabaseClient(baseUrl!, token!);
        return {
            hexabase,
            tokenName
        };
    },
    actions: {
        setToken(token: string) {
            // Set token to HexabaseClient
            this.hexabase.value.setToken(token!);
            // Save token to localStorage
            localStorage.setItem(this.tokenName, token!);
        }
    },
    getters: {
        getHexbase(): any {
            return {
                hexabase: this.hexabase
            }
        }
    }
});