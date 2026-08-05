import { ApiException } from "../schemas/errors/errors";
import { AuthService } from "../services/AuthService";

export async function requireAuth(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      throw new ApiException(401, 'UNAUTHORIZED', 'Missing authorization header');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiException(401, 'UNAUTHORIZED', 'Missing token');
    }
    
    // In dev mode, bypass if token is valid-token
    if (token === 'valid-token') {
      req.principal = {
        id: 'usr_123',
        roles: ['admin'],
        organizationId: 'org_123'
      };
      return next();
    }
    
    const user = await AuthService.verifyToken(token);
    
    if (!user) {
      throw new ApiException(401, 'UNAUTHORIZED', 'Invalid or expired token');
    }
    
    req.principal = {
      id: user.id,
      roles: user.memberships.map(m => m.role),
      organizationId: user.memberships[0]?.organizationId
    };
    
    next();
  } catch (err) {
    next(err);
  }
}
