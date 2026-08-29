import { POST } from "@/app/api/auth/signup/route";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

jest.mock("@/lib/db", () => ({ connectDB: jest.fn() }));
jest.mock("@/lib/models/User", () => ({
    __esModule: true,
    default: { findOne: jest.fn(), create: jest.fn() },
}));
jest.mock("jsonwebtoken", () => ({ __esModule: true, default: { sign: jest.fn() } }));
jest.mock("bcryptjs", () => ({ __esModule: true, default: { hash: jest.fn() } }));

const fakeReq = (body) => ({ json: async () => body });

beforeEach(() => jest.clearAllMocks());
test("missing fields -> 400", async () => {
    const res = await POST(fakeReq({ email: "test@test.com" }));
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.message).toMatch(/fill all/i);
});

test("existing email -> 400", async () => {
    User.findOne.mockResolvedValue({ _id: 1, email: "test@test.com" });
    const res = await POST(fakeReq({ name: "Bob", email: "test@test.com", password: "pass1234" }));
    expect(res.status).toBe(400);
});

test("valid signup goes through, password gets hashed", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpw");
    User.create.mockResolvedValue({ _id: "u1", name: "Bob", email: "bob@test.com" });
    jwt.sign.mockReturnValue("token123");

    const res = await POST(fakeReq({ name: "Bob", email: "bob@test.com", password: "pass1234" }));
    const body = await res.json();

    expect(bcrypt.hash).toHaveBeenCalledWith("pass1234", 10);
    expect(User.create).toHaveBeenCalledWith({ name: "Bob", email: "bob@test.com", password: "hashedpw" });
    expect(res.status).toBe(201);
    expect(body.user.id).toBe("u1");
    expect(res.cookies.get("token")).toBeTruthy();
});

test("db error -> 500", async () => {
    User.findOne.mockRejectedValue(new Error("db down"));
    const res = await POST(fakeReq({ name: "Bob", email: "bob@test.com", password: "pass1234" }));
    expect(res.status).toBe(500);
});