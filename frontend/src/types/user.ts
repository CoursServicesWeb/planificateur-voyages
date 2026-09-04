

import { type JwtPayload } from "jwt-decode";

export interface userData extends JwtPayload {
    given_name : string;
    role : string;
}

