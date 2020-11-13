import { User } from './user';
export class MainUser {
    token:string;
    user: User;
    tenant_id: string;
    hasPlan: boolean;
    plan_ends_at: number;
}