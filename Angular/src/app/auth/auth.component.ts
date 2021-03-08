import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions"

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
	authForm: FormGroup;

    private storeSub: Subscription;

	isLoginMode = true;
	isLoading = false;
	error: string = null;

	constructor(private store: Store<fromApp.AppState>, private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.isLoginMode = this.route.snapshot.url[0].path === "login";
		this.storeSub = this.store.select("auth").subscribe(authState => {
			this.isLoading = authState.loading;
			this.error = authState.authError;
		});
		this.initForm();
	}
	ngOnDestroy() {
        this.storeSub.unsubscribe();
    }

	private initForm() {
		this.authForm = new FormGroup({
			"username": new FormControl(null, Validators.required),
			"password": new FormControl(null, Validators.required),
		});
	}

	onSubmit() {
		if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ username: this.authForm.value.username, password: this.authForm.value.password }));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({ username: this.authForm.value.username, password: this.authForm.value.password }));
        }
	}

}
