import { Transition } from "@headlessui/react";
import cl from "classnames";
import React, { useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { api } from "../api";
import { RootState, useAppDispatch } from "../global/store";
import { userActions } from "./../global/reducers/user";

interface Props {}

const Navbar: React.FC<Props> = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const logoutMutation = useMutation("logout", api.user.logout);
  const user = useSelector((store: RootState) => store.user);
  const { logout } = userActions;
  const dispatch = useAppDispatch();
  const mainNav = useMemo(
    () => [
      { name: "Dashboard", url: "/dashboard" },
      { name: "Find new friends", url: "/friends/find" },
      { name: "Friends", url: "/friends" },
      { name: "Requests", url: "/requests" },
    ],
    []
  );
  const sideNavLinks = useMemo(
    () => [
      { name: "Register", url: "/register", cta: true },
      { name: "Login", url: "/login" },
    ],
    []
  );
  let sideNav = (
    <div className="items-center hidden ml-4 md:ml-6 md:flex ">
      <button className="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
        <span className="sr-only">View notifications</span>
        {/* Heroicon name: outline/bell */}
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      {/* Profile dropdown */}
      <div className={cl("relative ml-3 ")}>
        <div>
          <button
            type="button"
            className="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            id="user-menu"
            aria-expanded="false"
            aria-haspopup="true"
            onClick={() => setIsDropdownOpen((p) => !p)}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </button>
        </div>
        <Transition
          show={isDropdownOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Settings
            </Link>
            <button
              onClick={() =>
                logoutMutation
                  .mutateAsync()
                  .then(() => dispatch(logout()))
                  .catch((e) => console.log(e))
              }
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Sign Out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  );
  if (!user.isLoggedIn)
    sideNav = (
      <div className="flex items-baseline ml-10 space-x-4">
        {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
        {sideNavLinks.map((link) => (
          <Link
            key={link.url}
            to={link.url}
            className={cl(
              {
                "px-3 py-2 text-sm font-medium text-white bg-green-500 rounded-md":
                  link.cta,
              },
              {
                "px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white":
                  !link.cta,
              }
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  return (
    <>
      <nav className="bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/">
                  <img
                    className="w-8 h-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </Link>
              </div>

              <div className="hidden md:block">
                <div
                  className={cl("flex items-baseline ml-10 space-x-4", {
                    hidden: !user.isLoggedIn,
                  })}
                >
                  {mainNav.map((link) => (
                    <Link
                      key={link.url}
                      to={link.url}
                      className="px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-gray-900"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {sideNav}
            <div className="hidden md:block"></div>
            <div
              className={cl("flex mr-2 md:hidden", {
                hidden: !user.isLoggedIn,
              })}
            >
              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsOpen((p) => !p)}
              >
                <span className="sr-only">Open main menu</span>
                {/*
              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            */}
                <svg
                  className="block w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/*
              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            */}
                <svg
                  className="hidden w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu, show/hide based on menu state. */}
        <div className={cl("md:hidden", { hidden: !isOpen })} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
            {mainNav.map((link) => (
              <Link
                to={link.url}
                key={link.name}
                className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {user.name}
                </div>
                <div className="text-sm font-medium leading-none text-gray-400">
                  {user.email}
                </div>
              </div>
              <button className="flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                {/* Heroicon name: outline/bell */}
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div>
            <div className="px-2 mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
              >
                Your Profile
              </Link>

              <button
                onClick={() =>
                  logoutMutation
                    .mutateAsync()
                    .then(() => dispatch(logout()))
                    .catch((e) => console.log(e))
                }
                className="block w-full px-4 py-2 text-sm text-left text-gray-400 hover:text-white"
                role="menuitem"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
