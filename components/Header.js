import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";
const Header =() => {
    return (
      <Menu style={{ marginTop: "10px" }}>
        <Menu.Item>
          <Link
            style={{
              textDecoration: "none",
              color: "#000",
            }}
            href="/"
          >
            <a>Decentrium</a>
          </Link>
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item>
            <Link href='/blogs/new'>
              <a>Create Blog</a>
            </Link>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
};
export default Header;