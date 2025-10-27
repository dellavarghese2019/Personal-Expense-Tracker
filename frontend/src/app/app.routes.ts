import { Routes } from '@angular/router';
import { HomeComponent } from './auth/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AddExpenseComponent } from './auth/add-expense/add-expense.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path:'home',
        component:HomeComponent,
    },
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent 
    },
    {
        path:'dashboard',
        component:DashboardComponent, canActivate:[authGuard]
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'profile',
        component:ProfileComponent, canActivate:[authGuard]
    },
    {
        path:'add-expense',
        component:AddExpenseComponent, canActivate:[authGuard]
    },
    {
        path:'add-expense/:id',
        component:AddExpenseComponent, canActivate:[authGuard]
    }
];
