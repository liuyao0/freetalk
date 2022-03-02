// import React from 'react';
// import {Dimensions, Image, Text, View} from 'react-native';
// import HTMLView from 'react-native-htmlview';
// import PixelRatio from "react-native/Libraries/Utilities/PixelRatio";
// const { width } = Dimensions.get('window');
//
// export class RichTextShower extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     static defaultProps={
//         showsVerticalScrollIndicator:true
//     }
//
//     handleCursorPosition = (scrollY) => {
//         this.scrollRef.current.scrollTo({y: scrollY - 30, animated: true});
//     }
//
//     renderNode(node, index, siblings, parent, defaultRenderer) {
//         if (node.name === 'img') {
//             const { src, height } = node.attribs;
//             const imageHeight = height||300;
//             return (
//                 <Image
//                     key={index}
//                     style={{ width: width * PixelRatio.get()/5, height: imageHeight * PixelRatio.get()/5 }}
//                     source={{ uri: src }} />
//             );
//         }
//     }
//
//     render() {
//         return (
//             <View>
//                 <HTMLView
//                     value={`<div>${this.props.text}</div>`}
//                     renderNode={this.renderNode}
//                     addLineBreaks={true}
//                 />
//             </View>
//         );
//     }
// }
import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {RenderHTML} from 'react-native-render-html';
const { width } = Dimensions.get('window');
import { useWindowDimensions } from 'react-native';

const RichText=(props)=>{
    const window=useWindowDimensions();
    return(
        <RenderHTML
            source={{html:props.text}}
            contentWidth={window.width}
        />
    )
}

export class RichTextShower extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps={
        showsVerticalScrollIndicator:true
    }

    handleCursorPosition = (scrollY) => {
        this.scrollRef.current.scrollTo({y: scrollY - 30, animated: true});
    }


    render() {
        return (
            <View>
                <RichText
                    text={this.props.text}
                />
            </View>
        );
    }
}

