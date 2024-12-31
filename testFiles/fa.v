module full_adder(
    input A, B, Cin,  // Inputs
    output Sum, Cout  // Outputs
);
    assign Sum = A ^ B ^ Cin;        // Sum = A XOR B XOR Cin
    assign Cout = (A & B) | (B & Cin) | (A & Cin);  // Cout = (A AND B) OR (B AND Cin) OR (A AND Cin)
endmodule