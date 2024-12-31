`timescale 1ns/1ps

module tb_full_adder;
    reg A, B, Cin;    // Inputs for the full adder
    wire Sum, Cout;   // Outputs from the full adder

    // Instantiate the full adder module
    full_adder uut (
        .A(A), 
        .B(B), 
        .Cin(Cin), 
        .Sum(Sum), 
        .Cout(Cout)
    );

    // Testbench logic to apply test vectors and check results
    initial begin
        $dumpfile("dump.vcd");  // Specify the VCD file for GTKWave
        $dumpvars(0, tb_full_adder);  // Dump all variables in the testbench

        // Apply test vectors
        A = 0; B = 0; Cin = 0; #10;
        A = 0; B = 0; Cin = 1; #10;
        A = 0; B = 1; Cin = 0; #10;
        A = 1; B = 1; Cin = 1; #10;

        $finish;  // End simulation
    end
endmodule