export = verifyRoles;
declare function verifyRoles(...allowedRoles: any[]): (req: any, res: any, next: any) => any;
