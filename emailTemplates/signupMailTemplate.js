const signupMailTemplate  = (otp) => {
    return  `
    <mjml>
        <mj-body>
            <mj-section>
                <mj-column>
                    <mj-text>
                        <h1>Signup Successfully</h1>
                        <p>OTP</p>
                        <p>Don't share your OTP </p>
                        <p><strong>${otp}</strong></p>
                        
                    </mj-text>
                </mj-column>
            </mj-section>
        </mj-body>
    </mjml>
    `
}

module.exports = {signupMailTemplate};