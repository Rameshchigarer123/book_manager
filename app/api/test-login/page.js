import { POST } from "@/app/api/auth/login/route";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

jest.mock("@/lib/db", () => ({ connectDB: jest.fn() }));
jest.mock("@/lib/models/User", () => ({
    __esModule: true,
    default: { findOne: jest.fn() },
}));
jest.mock("jsonwebtoken", () => ({ __esModule: true, default: { sign: jest.fn() } }));

const fakeReq = (body) => ({ json: async () => body });

beforeEach(() => jest.clearAllMocks());

test("missing email or password -> 400", async () => {
    const res = await POST(fakeReq({ email: "bob@test.com" }));
    expect(res.status).toBe(400);
});

test("no user found -> 401", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await POST(fakeReq({ email: "ghost@test.com", password: "LUCK" }));
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body.message).toMatch(/invalid/i);
});

test("wrong password -> 401", async () => {
    const user = { _id: "u1", email: "bob@test.com", name: "Bob", comparePassword: jest.fn().mockResolvedValue(false) };
    User.findOne.mockResolvedValue(user);

    const res = await POST(fakeReq({ email: "bob@test.com", password: "nope" }));
    expect(user.comparePassword).toHaveBeenCalledWith("nope");
    expect(res.status).toBe(401);
});

test("correct login -> 200 + cookie", async () => {
    const user = { _id: "u1", email: "bob@test.com", name: "Bob", comparePassword: jest.fn().mockResolvedValue(true) };
    User.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue("sometoken");

    const res = await POST(fakeReq({ email: "bob@test.com", password: "correct" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.user.email).toBe("bob@test.com");
    expect(res.cookies.get("token")).toBeTruthy();
});

test("throws -> 500", async () => {
    User.findOne.mockRejectedValue(new Error("db down"));
    const res = await POST(fakeReq({ email: "bob@test.com", password: "whatever" }));
    expect(res.status).toBe(500);
});