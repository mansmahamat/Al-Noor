import { cloneElement, useContext } from "react";
import { getSize, getSpace } from "@tamagui/get-token";
import {
    createStyledContext,
    GetProps,
    SizeTokens,
    Stack,
    styled,
    Text,
    useTheme,
    withStaticProperties
} from "@tamagui/web";
export const ButtonContext = createStyledContext({
    size: "$md"
});
export const ButtonFrame = styled(Stack, {
    name: "Button",

    context: ButtonContext,

    backgroundColor: "$background",

    alignItems: "center",

    flexDirection: "row",
    hoverStyle: {
        backgroundColor: "$backgroundHover"
    },
    pressStyle: {
        backgroundColor: "$backgroundPress"
    },
    variants: {
        size: {
            "...size": (name, { tokens }) => {
                return {
                    height: tokens.size[name],

                    borderRadius: tokens.radius[name],

                    // note the getSpace and getSize helpers will let you shift down/up token sizes

                    // whereas with gap we just multiply by 0.2

                    // this is a stylistic choice, and depends on your design system values

                    gap: tokens.space[name].val * 0.2,

                    paddingHorizontal: getSpace(name, {
                        shift: -1
                    })
                };
            }
        }
    },
    defaultVariants: {
        size: "$md"
    }
});
export const ButtonText = styled(Text, {
    name: "ButtonText",

    context: ButtonContext,

    color: "$color",

    userSelect: "none",
    variants: {
        size: {
            "...fontSize": (name, { font }) => ({
                fontSize: font?.size[name]
            })
        }
    }
});
const ButtonIcon = (props) => {
    const { size } = useContext(ButtonContext.context);

    const smaller = getSize(size, {
        shift: -2
    });

    const theme = useTheme();

    return cloneElement(props.children, {
        size: smaller.val * 0.5,

        color: theme.color.get()
    });
};
export const Button = withStaticProperties(ButtonFrame, {
    Props: ButtonContext.Provider,

    Text: ButtonText,

    Icon: ButtonIcon
});
