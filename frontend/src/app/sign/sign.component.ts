import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({ 
    selector: 'app-sign',
    templateUrl: 'sign.component.html',
    styleUrls: ['./sign.component.scss'] 
})

export class SignComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    imagePreview: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AuthService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            jobTitle: ['', Validators.required],
            email: ['', Validators.required],
            imageUrl: [null],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onFileAdded(event: Event) {      
        const file = (event.target as HTMLInputElement).files[0];
        this.form.value.imageUrl  = file.name;
      
      }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value, )
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['/home'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}